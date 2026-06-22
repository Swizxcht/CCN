const db =
require("../config/db");

function ensureBillingColumns(callback) {
  db.query(
    "SHOW COLUMNS FROM bills",
    (err, columns) => {
      if (err) return callback(err);

      const existing = columns.map((column) => column.Field);
      const missing = [
        ["billing_start_date", "DATE NULL"],
        ["billing_end_date", "DATE NULL"],
        ["penalty_amount", "DECIMAL(10,2) NOT NULL DEFAULT 0"],
      ].filter(([name]) => !existing.includes(name));

      if (missing.length === 0) return callback();

      const alterSql = `
        ALTER TABLE bills
        ${missing.map(([name, definition]) => `ADD COLUMN ${name} ${definition}`).join(", ")}
      `;

      db.query(alterSql, callback);
    }
  );
}

function refreshBillPenalties(callback) {
  ensureBillingColumns((columnErr) => {
    if (columnErr) return callback(columnErr);

    db.query(
      `
      UPDATE bills
      SET
        penalty_amount = CASE
          WHEN due_date < CURDATE()
            AND status != 'Paid'
          THEN DATEDIFF(CURDATE(), due_date) * 20
          ELSE 0
        END,
        remaining_balance = GREATEST(
          amount
          + CASE
              WHEN due_date < CURDATE()
                AND status != 'Paid'
              THEN DATEDIFF(CURDATE(), due_date) * 20
              ELSE 0
            END
          - amount_paid,
          0
        ),
        status = CASE
          WHEN amount_paid >= amount
            + CASE
                WHEN due_date < CURDATE()
                  AND status != 'Paid'
                THEN DATEDIFF(CURDATE(), due_date) * 20
                ELSE 0
              END
          THEN 'Paid'
          WHEN due_date < CURDATE() THEN 'Overdue'
          WHEN amount_paid > 0 THEN 'Partial'
          ELSE 'Unpaid'
        END
      WHERE status != 'Paid'
      `,
      callback
    );
  });
}

exports.recordPayment =
(req, res) => {

  const {
    bill_id,
    amount,
    payment_date,
    payment_method
  } = req.body;

  if (!bill_id || !amount || !payment_date || !payment_method) {
    return res.status(400).json({
      message: "bill_id, amount, payment_date, and payment_method are required"
    });
  }

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(
    `
    SELECT
      b.id,
      b.amount_paid,
      b.remaining_balance,
      b.status,
      s.user_id,
      s.id AS subscriber_id
    FROM bills b
    JOIN subscribers s
      ON s.id = b.subscriber_id
    WHERE b.id = ?
    `,
    [bill_id],
      (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Bill not found"
        });
      }

      const bill = results[0];

      if (bill.status === "Paid") {
        return res.status(400).json({
          message: "This bill is already paid"
        });
      }

      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && req.user?.id !== bill.user_id) {
        return res.status(403).json({
          message: "You are not allowed to pay this bill"
        });
      }

      const paymentAmount = Number(amount);
      const remaining = Number(bill.remaining_balance || 0);

      if (paymentAmount <= 0) {
        return res.status(400).json({
          message: "Payment amount must be greater than zero"
        });
      }

      if (paymentAmount > remaining) {
        return res.status(400).json({
          message: "Payment amount cannot exceed remaining balance"
        });
      }

      const newRemaining = remaining - paymentAmount;
      const amountPaid = Number(bill.amount_paid || 0) + paymentAmount;
      const newStatus = newRemaining <= 0 ? "Paid" : "Partial";
      const receipt_no = `OR-${Date.now()}`;

      db.query(
        `
        INSERT INTO payments
        (
          bill_id,
          receipt_no,
          amount,
          payment_date,
          payment_method
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
          bill_id,
          receipt_no,
          paymentAmount,
          payment_date,
          payment_method
        ],
        (insertErr) => {
          if (insertErr) {
            return res.status(500).json(insertErr);
          }

          db.query(
            `
            UPDATE bills
            SET amount_paid = ?,
                remaining_balance = ?,
                status = ?
            WHERE id = ?
            `,
            [
              amountPaid,
              newRemaining,
              newStatus,
              bill_id
            ],
            (updateErr) => {
              if (updateErr) {
                return res.status(500).json(updateErr);
              }

              res.json({
                message: "Payment recorded",
                receipt_no,
                bill_id: bill.id,
                subscriber_id: bill.subscriber_id,
                status: newStatus
              });
            }
          );
        }
      );
      }
    );
  });

};

exports.getPayments =
(req, res) => {

  db.query(
    `
    SELECT

      p.*,

      b.billing_month,

      u.name

    FROM payments p

    JOIN bills b
    ON b.id =
    p.bill_id

    JOIN subscribers s
    ON s.id =
    b.subscriber_id

    JOIN users u
    ON u.id =
    s.user_id

    ORDER BY
    p.created_at DESC
    `,
    (err, results) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(results);

    }
  );

};

exports.getSubscriberPayments =
(req, res) => {

  db.query(
    `
    SELECT

      p.*,

      b.billing_month

    FROM payments p

    JOIN bills b
    ON b.id =
    p.bill_id

    WHERE
    b.subscriber_id = ?

    ORDER BY
    p.created_at DESC
    `,
    [req.params.id],
    (err, results) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(results);

    }
  );

};

exports.getOutstandingBalance =
(req, res) => {

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(
      `
      SELECT

        COALESCE(
          SUM(remaining_balance),
          0
        ) AS balance

      FROM bills

      WHERE
      subscriber_id = ?

      AND status != 'Paid'
      `,
      [req.params.id],
      (err, results) => {

        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json(
          results[0]
        );

      }
    );
  });

};

exports.getUnpaidBills =
(req, res) => {
  const isAdmin = req.user?.role === "admin";

  const query = isAdmin
    ? `
        SELECT
          b.id,
          b.billing_month,
          b.amount,
          b.amount_paid,
          b.remaining_balance,
          b.due_date,
          b.subscriber_id,
          s.subscriber_no,
          u.name
        FROM bills b
        JOIN subscribers s ON s.id = b.subscriber_id
        JOIN users u ON u.id = s.user_id
        WHERE b.status != 'Paid'
        ORDER BY b.created_at DESC
      `
    : `
        SELECT
          b.id,
          b.billing_month,
          b.amount,
          b.amount_paid,
          b.remaining_balance,
          b.due_date,
          b.subscriber_id,
          s.subscriber_no,
          u.name
        FROM bills b
        JOIN subscribers s ON s.id = b.subscriber_id
        JOIN users u ON u.id = s.user_id
        WHERE b.status != 'Paid'
          AND u.id = ?
        ORDER BY b.created_at DESC
      `;

  const params = isAdmin ? [] : [req.user.id];

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(query, params, (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);
    });
  });
};

exports.getBalanceSummary =
(req, res) => {

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(
    `
    SELECT

      COUNT(*) AS total_bills,

      COALESCE(
        SUM(amount),
        0
      ) AS total_amount,

      COALESCE(
        SUM(amount_paid),
        0
      ) AS total_paid,

      COALESCE(
        SUM(remaining_balance),
        0
      ) AS total_remaining

    FROM bills

    WHERE subscriber_id = ?
    `,
    [req.params.id],
      (err, results) => {

      if (err) {

        return res
          .status(500)
          .json(err);

      }

      res.json(
        results[0]
      );

      }
    );
  });

};


exports.getMyPayments =
(req, res) => {

  db.query(
    `
    SELECT

      p.*,

      b.billing_month

    FROM payments p

    JOIN bills b
    ON b.id = p.bill_id

    JOIN subscribers s
    ON s.id = b.subscriber_id

    WHERE s.user_id = ?

    ORDER BY
    p.created_at DESC
    `,
    [req.user.id],
    (err, results) => {

      if (err) {

        return res
          .status(500)
          .json(err);

      }

      res.json(results);

    }
  );

};
