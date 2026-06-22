const db = require("../config/db");

function generateJobOrder() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `JO-${year}-${random}`;
}

const ensureSubscriberProfileColumns = (callback) => {
  db.query(
    "SHOW COLUMNS FROM subscribers",
    (err, columns) => {
      if (err) {
        return callback(err);
      }

      const existing = columns.map((column) => column.Field);
      const missing = [
        ["full_name", "VARCHAR(255) NULL"],
        ["latitude", "VARCHAR(50) NULL"],
        ["longitude", "VARCHAR(50) NULL"],
        ["house_image", "VARCHAR(255) NULL"],
      ].filter(([name]) => !existing.includes(name));

      if (missing.length === 0) {
        return callback();
      }

      const alterSql = `
        ALTER TABLE subscribers
        ${missing.map(([name, definition]) => `ADD COLUMN ${name} ${definition}`).join(", ")}
      `;

      db.query(alterSql, callback);
    }
  );
};

const validRequestStatuses = ["Pending", "Assigned", "On-going", "Resolved"];

const normalizeRequestStatuses = (callback) => {
  db.query(
    `
    UPDATE service_requests
    SET status = CASE
      WHEN status IN ('In Progress', 'On Site') THEN 'On-going'
      ELSE status
    END
    WHERE status IN ('In Progress', 'On Site')
    `,
    callback
  );
};

exports.createRequest = (req, res) => {

  const {
    account_number,
    contact_number,
    address,
    issue_description
  } = req.body;

  const userId = req.user.id;

  db.query(
    `
    INSERT INTO service_requests
    (
      user_id,
      account_number,
      contact_number,
      address,
      issue_description,
      status
    )
    VALUES (?, ?, ?, ?, ?, 'Pending')
    `,
    [
      userId,
      account_number,
      contact_number,
      address,
      issue_description
    ],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Service request submitted successfully"
      });

    }
  );

};

exports.getMyRequests = (
  req,
  res
) => {

  db.query(
    `
    SELECT
      sr.*, 
      t.id AS technician_id,
      t.name AS technician_name,
      t.email AS technician_email
    FROM service_requests sr
    LEFT JOIN users t ON t.id = sr.assigned_to
    WHERE sr.user_id = ?
    ORDER BY sr.created_at DESC
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

exports.getAllRequests = (req, res) => {

  db.query(
    `
    SELECT

      sr.*,
      u.name,
      u.email,
      t.id AS technician_id,
      t.name AS technician_name

    FROM service_requests sr

    JOIN users u
    ON u.id = sr.user_id
    LEFT JOIN users t ON t.id = sr.assigned_to

    ORDER BY sr.created_at DESC
    `,
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);

    }
  );

};

exports.updateStatus = (
  req,
  res
) => {

  const { status } =
    req.body;

  if (!validRequestStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid request status" });
  }

  db.query(
    `
    UPDATE service_requests
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      req.params.id,
    ],
    (err) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Status updated",
      });

    }
  );

};

exports.updateRequestStatus = (req, res) => {

  const { status } = req.body;

  if (!validRequestStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid request status" });
  }

  const { id } = req.params;

  db.query(
    `
    UPDATE service_requests
    SET status = ?
    WHERE id = ?
    `,
    [status, id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Status updated successfully"
      });

    }
  );

};

exports.createServiceRequest = (req, res) => {

  const {
    issue_type,
    issue_description,
    contact_number,
    address
  } = req.body;

  const userId = req.user.id;
  const jobOrderNo = generateJobOrder();

  db.query(
    `
    SELECT subscriber_no, contact_number, address
    FROM subscribers
    WHERE user_id = ?
      AND account_status = 'Active'
    LIMIT 1
    `,
    [userId],
    (subscriberErr, subscribers) => {

      if (subscriberErr) {
        return res.status(500).json(subscriberErr);
      }

      if (subscribers.length === 0) {
        return res.status(400).json({
          message: "An active subscriber account is required to submit a service request."
        });
      }

      const subscriber = subscribers[0];

      db.query(
        `
        INSERT INTO service_requests
        (
          job_order_no,
          user_id,
          account_number,
          issue_type,
          contact_number,
          address,
          issue_description,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
        `,
        [
          jobOrderNo,
          userId,
          subscriber.subscriber_no,
          issue_type || null,
          contact_number || subscriber.contact_number,
          address || subscriber.address,
          issue_description
        ],
        (err) => {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            message: "Service request submitted",
            job_order_no: jobOrderNo
          });

        }
      );

    }
  );

};

exports.getAllServiceRequests = (req, res) => {

  normalizeRequestStatuses((statusErr) => {
    if (statusErr) return res.status(500).json(statusErr);

    db.query(
      `
      SELECT
        sr.*, 
        u.name AS customer_name,
        u.email AS customer_email,
        t.id AS technician_id,
        t.name AS technician_name
      FROM service_requests sr
      JOIN users u ON u.id = sr.user_id
      LEFT JOIN users t ON t.id = sr.assigned_to
      ORDER BY sr.created_at DESC
      `,
      (err, results) => {

        if (err) return res.status(500).json(err);

        res.json(results);

      }
    );
  });

};

exports.getAssignedRequests = (req, res) => {
  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    normalizeRequestStatuses((statusErr) => {
      if (statusErr) return res.status(500).json(statusErr);

      db.query(
        `
        SELECT
          sr.*,
          u.name AS customer_name,
          u.email AS customer_email,
          COALESCE(s.full_name, u.name) AS subscriber_name,
          COALESCE(s.subscriber_no, sr.account_number) AS subscriber_no,
          COALESCE(s.contact_number, sr.contact_number) AS customer_contact,
          COALESCE(s.address, sr.address) AS customer_address,
          s.street,
          s.barangay,
          s.city,
          s.province,
          s.postal_code,
          s.latitude,
          s.longitude,
          s.house_image
        FROM service_requests sr
        JOIN users u ON u.id = sr.user_id
        LEFT JOIN subscribers s
          ON s.user_id = sr.user_id
          AND (
            s.subscriber_no = sr.account_number
            OR sr.account_number IS NULL
          )
        WHERE sr.assigned_to = ?
        ORDER BY sr.created_at DESC
        `,
        [req.user.id],
        (err, results) => {
          if (err) return res.status(500).json(err);
          res.json(results);
        }
      );
    });
  });
};

exports.getPendingRequests = (req, res) => {
  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    db.query(
      `
      SELECT
        sr.*,
        u.name AS customer_name,
        u.email AS customer_email,
        COALESCE(s.full_name, u.name) AS subscriber_name,
        COALESCE(s.subscriber_no, sr.account_number) AS subscriber_no,
        COALESCE(s.contact_number, sr.contact_number) AS customer_contact,
        COALESCE(s.address, sr.address) AS customer_address,
        s.street,
        s.barangay,
        s.city,
        s.province,
        s.postal_code,
        s.latitude,
        s.longitude,
        s.house_image
      FROM service_requests sr
      JOIN users u ON u.id = sr.user_id
      LEFT JOIN subscribers s
        ON s.user_id = sr.user_id
        AND (
          s.subscriber_no = sr.account_number
          OR sr.account_number IS NULL
        )
      WHERE sr.status = 'Pending'
        AND sr.assigned_to IS NULL
      ORDER BY sr.created_at ASC
      `,
      (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
      }
    );
  });
};

exports.claimRequest = (req, res) => {
  const requestId = req.params.id;
  const technicianId = req.user.id;

  db.query(
    `
    UPDATE service_requests
    SET assigned_to = ?, status = 'Assigned'
    WHERE id = ?
      AND status = 'Pending'
      AND assigned_to IS NULL
    `,
    [technicianId, requestId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Request not available for claim"
        });
      }
      res.json({
        message: "Request claimed successfully"
      });
    }
  );
};

exports.getTechnicians = (req, res) => {
  db.query(
    `
    SELECT id, name, email
    FROM users
    WHERE role = 'technician'
    ORDER BY name ASC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.assignTechnician = (req, res) => {

  const { request_id, technician_id } = req.body;

  db.query(
    `
    UPDATE service_requests
    SET
      assigned_to = ?,
      status = 'Assigned'
    WHERE id = ?
    `,
    [technician_id, request_id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "Technician assigned successfully"
      });

    }
  );

};

exports.updateAssignedRequestStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const technicianId = req.user.id;

  if (!validRequestStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid request status" });
  }

  db.query(
    `
    UPDATE service_requests
    SET status = ?
    WHERE id = ? AND assigned_to = ?
    `,
    [status, id, technicianId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found or not assigned to you" });
      }
      res.json({
        message: "Status updated"
      });
    }
  );
};
