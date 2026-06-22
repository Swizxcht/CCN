const db =
require("../config/db");

function getCurrentBillingMonth() {
  const now = new Date();
  return now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getDefaultDueDate() {
  const due = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
  return due.toISOString().slice(0, 10);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

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

function markBillsOverdue(callback) {
  db.query(
    `
    UPDATE bills
    SET status = 'Overdue'
    WHERE due_date < CURDATE()
      AND status IN ('Unpaid', 'Partial')
    `,
    callback
  );
}

function ensureCurrentMonthBillsForActiveSubscribers(callback) {
  const billingMonth = getCurrentBillingMonth();
  const dueDate = getDefaultDueDate();

  db.query(
    `
    SELECT
      s.id AS subscriber_id,
      COALESCE(ip.monthly_fee, 0) AS internet_fee,
      COALESCE(cp.monthly_fee, 0) AS cable_fee
    FROM subscribers s
    JOIN subscriber_services ss
      ON ss.subscriber_id = s.id
    LEFT JOIN internet_plans ip
      ON ip.id = ss.internet_plan_id
    LEFT JOIN cable_plans cp
      ON cp.id = ss.cable_plan_id
    WHERE s.account_status = 'Active'
    `,
    (err, results) => {
      if (err) return callback(err);

      const tasks = results.map((sub) => {
        return new Promise((resolve, reject) => {
          db.query(
            `
            SELECT id FROM bills
            WHERE subscriber_id = ?
              AND billing_month = ?
            `,
            [sub.subscriber_id, billingMonth],
            (checkErr, existing) => {
              if (checkErr) return reject(checkErr);

              if (existing.length > 0) {
                return resolve();
              }

              const total =
                Number(sub.internet_fee) +
                Number(sub.cable_fee);

              db.query(
                `
                INSERT INTO bills
                (
                  subscriber_id,
                  billing_month,
                  amount,
                  amount_paid,
                  remaining_balance,
                  due_date,
                  status
                )
                VALUES
                (?, ?, ?, 0, ?, ?, 'Unpaid')
                `,
                [
                  sub.subscriber_id,
                  billingMonth,
                  total,
                  total,
                  dueDate,
                ],
                (insertErr) => {
                  if (insertErr) reject(insertErr);
                  else resolve();
                }
              );
            }
          );
        });
      });

      Promise.all(tasks)
        .then(() => callback(null))
        .catch(callback);
    }
  );
}

exports.generateBill =
(req, res) => {

  const {
    subscriber_id,
    billing_month,
    due_date
  } = req.body;

  if (!subscriber_id || !billing_month || !due_date) {
    return res.status(400).json({
      message: "subscriber_id, billing_month, and due_date are required"
    });
  }

  ensureBillingColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    db.query(
    `
    SELECT
      COALESCE(ip.monthly_fee, 0) AS internet_fee,
      COALESCE(cp.monthly_fee, 0) AS cable_fee
    FROM subscriber_services ss
    LEFT JOIN internet_plans ip
      ON ip.id = ss.internet_plan_id
    LEFT JOIN cable_plans cp
      ON cp.id = ss.cable_plan_id
    WHERE ss.subscriber_id = ?
    LIMIT 1
    `,
    [subscriber_id],
      (err, results) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      if (
        results.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
            "No plan assigned"
          });
      }

      const amount =
        Number(results[0].internet_fee) +
        Number(results[0].cable_fee);

      db.query(
        `
        SELECT id FROM bills
        WHERE subscriber_id = ?
        AND billing_month = ?
        `,
        [subscriber_id, billing_month],
        (checkErr, existing) => {
          if (checkErr) {
            return res.status(500).json(checkErr);
          }

          if (existing.length > 0) {
            return res.status(400).json({
              message: "Bill already exists for this month"
            });
          }

          const billingStartDate = subtractDays(due_date, 29);

          db.query(
            `
            INSERT INTO bills
            (
              subscriber_id,
              billing_month,
              billing_start_date,
              billing_end_date,
              amount,
              penalty_amount,
              amount_paid,
              remaining_balance,
              due_date,
              status
            )
            VALUES
            (
              ?,
              ?,
              ?,
              ?,
              ?,
              0,
              0,
              ?,
              ?,
              'Unpaid'
            )
            `,
            [
              subscriber_id,
              billing_month,
              billingStartDate,
              due_date,
              amount,
              amount,
              due_date
            ],
            (insertErr) => {
              if (insertErr) {
                return res
                  .status(500)
                  .json(insertErr);
              }

              res.json({
                message:
                  "Bill generated",
                amount
              });
            }
          );
        }
      );
      }
    );
  });
};

exports.getBills =
(req, res) => {
  refreshBillPenalties((err) => {
    if (err) {
      return res.status(500).json(err);
    }

      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
      const offset = (page - 1) * limit;

      db.query(
        `
        SELECT COUNT(*) AS total
        FROM bills b
        JOIN subscribers s ON s.id = b.subscriber_id
        JOIN users u ON u.id = s.user_id
        `,
        (countErr, countResult) => {
          if (countErr) {
            return res.status(500).json(countErr);
          }

          const total = countResult[0]?.total || 0;

          db.query(
            `
            SELECT
              b.*,
              s.subscriber_no,
              u.name
            FROM bills b
            JOIN subscribers s ON s.id = b.subscriber_id
            JOIN users u ON u.id = s.user_id
            ORDER BY b.created_at DESC
            LIMIT ?
            OFFSET ?
            `,
            [limit, offset],
            (err, results) => {
              if (err) {
                return res.status(500).json(err);
              }

              res.json({
                bills: results,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
              });
            }
          );
        }
      );
  });
};

exports.getSubscriberBills =
(req, res) => {

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(
      `
      SELECT *
      FROM bills

      WHERE
      subscriber_id = ?

      ORDER BY
      created_at DESC
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
  });

};

exports.generateMonthlyBills = (req, res) => {

  const { billing_month, due_date } = req.body;

  if (!billing_month || !due_date) {
    return res.status(400).json({
      message: "billing_month and due_date are required"
    });
  }

  ensureBillingColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    const billingStartDate = subtractDays(due_date, 29);

    db.query(
    `
    SELECT
      s.id AS subscriber_id,
      COALESCE(ip.monthly_fee, 0) AS internet_fee,
      COALESCE(cp.monthly_fee, 0) AS cable_fee
    FROM subscribers s
    JOIN subscriber_services ss ON ss.subscriber_id = s.id
    LEFT JOIN internet_plans ip
      ON ip.id = ss.internet_plan_id
    LEFT JOIN cable_plans cp
      ON cp.id = ss.cable_plan_id
    WHERE s.account_status = 'Active'
    `,
      (err, results) => {

      if (err) return res.status(500).json(err);

      let generated = 0;
      let skipped = 0;

      const tasks = results.map(sub => {
        return new Promise((resolve, reject) => {
          db.query(
            `
            SELECT id FROM bills
            WHERE subscriber_id = ?
            AND (
              billing_month = ?
              OR (
                billing_start_date = ?
                AND billing_end_date = ?
              )
            )
            `,
            [sub.subscriber_id, billing_month, billingStartDate, due_date],
            (err2, existing) => {
              if (err2) return reject(err2);

              if (existing.length > 0) {
                skipped += 1;
                return resolve(); // already billed
              }

              const total =
                Number(sub.internet_fee || 0) +
                Number(sub.cable_fee || 0);

              db.query(
                `
                INSERT INTO bills
                (
                  subscriber_id,
                  billing_month,
                  billing_start_date,
                  billing_end_date,
                  amount,
                  penalty_amount,
                  amount_paid,
                  remaining_balance,
                  due_date,
                  status
                )
                VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, 'Unpaid')
                `,
                [
                  sub.subscriber_id,
                  billing_month,
                  billingStartDate,
                  due_date,
                  total,
                  total,
                  due_date
                ],
                (err3) => {
                  if (err3) reject(err3);
                  else {
                    generated += 1;
                    resolve();
                  }
                }
              );
            }
          );
        });
      });

      Promise.all(tasks)
        .then(() => {
          res.json({
            message: "Billing cycle completed safely",
            generated,
            skipped
          });
        })
        .catch(err => {
          res.status(500).json(err);
        });
      }
    );
  });
};

exports.updateOverdueBills =
(req, res) => {

  refreshBillPenalties((err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Overdue bills and penalties updated"
      });

    });

};

exports.getMyBills =
(req, res) => {
  refreshBillPenalties((err) => {
    if (err) {
      return res.status(500).json(err);
    }

      db.query(
        `
        SELECT
          b.*
        FROM bills b
        JOIN subscribers s
          ON s.id = b.subscriber_id
        WHERE s.user_id = ?
        ORDER BY b.created_at DESC
        `,
        [req.user.id],
        (err3, results) => {
          if (err3) {
            return res.status(500).json(err3);
          }

          const pendingBills = results.filter((bill) =>
            bill.status === "Unpaid" ||
            bill.status === "Partial" ||
            bill.status === "Overdue"
          );
          const pending_total = pendingBills.reduce(
            (sum, bill) => sum + Number(bill.remaining_balance || 0),
            0
          );
          const pending_count = pendingBills.length;
          const next_due_date = pendingBills
            .map((bill) => bill.due_date)
            .filter(Boolean)
            .sort()[0] || null;

          res.json({
            bills: results,
            pending_total,
            pending_count,
            next_due_date,
          });
        }
      );
  });
};

exports.getBillingHistory = (req, res) => {

  const { subscriber_id } = req.params;

  refreshBillPenalties((penaltyErr) => {
    if (penaltyErr) return res.status(500).json(penaltyErr);

    db.query(
      `
      SELECT *
      FROM bills
      WHERE subscriber_id = ?
      ORDER BY billing_month DESC
      `,
      [subscriber_id],
      (err, results) => {

        if (err) return res.status(500).json(err);

        res.json(results);

      }
    );
  });

};
