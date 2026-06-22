const db = require("../config/db");

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
        ["email", "VARCHAR(255) NULL"],
        ["birthday", "DATE NULL"],
        ["spouse", "VARCHAR(255) NULL"],
        ["wedding_anniversary", "DATE NULL"],
        ["id_image", "VARCHAR(255) NULL"],
        ["street", "VARCHAR(255) NULL"],
        ["barangay", "VARCHAR(255) NULL"],
        ["city", "VARCHAR(255) NULL"],
        ["province", "VARCHAR(255) NULL"],
        ["postal_code", "VARCHAR(30) NULL"],
        ["latitude", "VARCHAR(50) NULL"],
        ["longitude", "VARCHAR(50) NULL"],
        ["house_image", "VARCHAR(255) NULL"],
        ["installation_assigned_to", "INT NULL"],
        ["installation_status", "VARCHAR(50) NULL"],
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

const buildAddress = ({
  street,
  barangay,
  city,
  province,
  postal_code,
  address,
}) => {
  const parts = [street, barangay, city, province, postal_code]
    .map((part) => (part || "").trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : address;
};

const installationSelect = `
  SELECT
    s.id,
    s.subscriber_no,
    s.full_name,
    s.email AS application_email,
    s.birthday,
    s.spouse,
    s.wedding_anniversary,
    s.contact_number,
    s.address,
    s.street,
    s.barangay,
    s.city,
    s.province,
    s.postal_code,
    s.id_image,
    s.latitude,
    s.longitude,
    s.house_image,
    s.installation_date AS requested_date,
    s.installation_assigned_to,
    COALESCE(s.installation_status, 'Pending') AS installation_status,
    s.account_status,
    u.name,
    u.email,
    ip.plan_name AS internet_plan,
    ip.speed,
    ip.monthly_fee AS internet_fee,
    cp.plan_name AS cable_plan,
    cp.monthly_fee AS cable_fee,
    ss.start_date
  FROM subscribers s
  JOIN users u ON u.id = s.user_id
  LEFT JOIN subscriber_services ss ON ss.subscriber_id = s.id
  LEFT JOIN internet_plans ip ON ip.id = ss.internet_plan_id
  LEFT JOIN cable_plans cp ON cp.id = ss.cable_plan_id
`;

const normalizeInstallationStatuses = (callback) => {
  db.query(
    `
    UPDATE subscribers
    SET installation_status = CASE
      WHEN installation_status IN ('Scheduled', 'On Site') THEN 'On-going'
      WHEN installation_status = 'Installed' THEN 'Resolved'
      ELSE installation_status
    END
    WHERE installation_status IN ('Scheduled', 'On Site', 'Installed')
    `,
    callback
  );
};

const ensureBillingColumns = (callback) => {
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
};

const createInitialBillForSubscriber = (subscriberId, callback) => {
  ensureBillingColumns((columnErr) => {
    if (columnErr) return callback(columnErr);

    db.query(
      `
      SELECT
        COALESCE(ip.monthly_fee, 0) AS internet_fee,
        COALESCE(cp.monthly_fee, 0) AS cable_fee
      FROM subscriber_services ss
      LEFT JOIN internet_plans ip ON ip.id = ss.internet_plan_id
      LEFT JOIN cable_plans cp ON cp.id = ss.cable_plan_id
      WHERE ss.subscriber_id = ?
      LIMIT 1
      `,
      [subscriberId],
      (planErr, plans) => {
        if (planErr) return callback(planErr);
        if (plans.length === 0) return callback(null, { generated: false });

        const amount =
          Number(plans[0].internet_fee || 0) +
          Number(plans[0].cable_fee || 0);

        db.query(
          `
          SELECT id
          FROM bills
          WHERE subscriber_id = ?
            AND billing_start_date = CURDATE()
            AND billing_end_date = DATE_ADD(CURDATE(), INTERVAL 29 DAY)
          LIMIT 1
          `,
          [subscriberId],
          (checkErr, existing) => {
            if (checkErr) return callback(checkErr);
            if (existing.length > 0) {
              return callback(null, { generated: false });
            }

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
                CONCAT(
                  DATE_FORMAT(CURDATE(), '%M %e, %Y'),
                  ' - ',
                  DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 29 DAY), '%M %e, %Y')
                ),
                CURDATE(),
                DATE_ADD(CURDATE(), INTERVAL 29 DAY),
                ?,
                0,
                0,
                ?,
                DATE_ADD(CURDATE(), INTERVAL 29 DAY),
                'Unpaid'
              )
              `,
              [subscriberId, amount, amount],
              (insertErr) => {
                if (insertErr) return callback(insertErr);
                callback(null, { generated: true, amount });
              }
            );
          }
        );
      }
    );
  });
};

const officialInternetPlans = [
  ["Internet 30 Mbps", "30 Mbps", 500],
  ["Internet 50 Mbps", "50 Mbps", 999],
  ["Internet 100 Mbps", "100 Mbps", 1399],
  ["Internet 200 Mbps", "200 Mbps", 1599],
];

const officialCablePlans = [
  ["Cable Plan", 380],
];

const runPlanTasks = (tasks, callback) => {
  tasks
    .reduce(
      (chain, task) =>
        chain.then(
          () =>
            new Promise((resolve, reject) => {
              task((err) => {
                if (err) reject(err);
                else resolve();
              });
            })
        ),
      Promise.resolve()
    )
    .then(() => callback())
    .catch(callback);
};

const syncOfficialPlans = (callback) => {
  const tasks = [
    ...officialInternetPlans.map(([planName, speed, monthlyFee]) => (done) => {
      db.query(
        "SELECT id FROM internet_plans WHERE speed = ? LIMIT 1",
        [speed],
        (err, existing) => {
          if (err) return done(err);

          if (existing.length > 0) {
            return db.query(
              "UPDATE internet_plans SET plan_name = ?, monthly_fee = ? WHERE id = ?",
              [planName, monthlyFee, existing[0].id],
              done
            );
          }

          db.query(
            "INSERT INTO internet_plans (plan_name, speed, monthly_fee) VALUES (?, ?, ?)",
            [planName, speed, monthlyFee],
            done
          );
        }
      );
    }),
    ...officialCablePlans.map(([planName, monthlyFee]) => (done) => {
      db.query(
        "SELECT id FROM cable_plans WHERE monthly_fee = ? LIMIT 1",
        [monthlyFee],
        (err, existing) => {
          if (err) return done(err);

          if (existing.length > 0) {
            return db.query(
              "UPDATE cable_plans SET plan_name = ? WHERE id = ?",
              [planName, existing[0].id],
              done
            );
          }

          db.query(
            "INSERT INTO cable_plans (plan_name, monthly_fee) VALUES (?, ?)",
            [planName, monthlyFee],
            done
          );
        }
      );
    }),
  ];

  runPlanTasks(tasks, callback);
};

exports.getSubscribers =
(req, res) => {

  db.query(
`
SELECT
  s.*,
  u.name,
  u.email,
  ip.plan_name AS internet_plan,
  ip.speed,
  cp.plan_name AS cable_plan

FROM subscribers s

JOIN users u
ON s.user_id = u.id

LEFT JOIN subscriber_services ss
ON ss.subscriber_id = s.id

LEFT JOIN internet_plans ip
ON ip.id = ss.internet_plan_id

LEFT JOIN cable_plans cp
ON cp.id = ss.cable_plan_id

ORDER BY s.created_at DESC
`,
(err, results) => {

  if (err) {
    return res
      .status(500)
      .json(err);
  }

  res.json(results);

});

};

exports.getAvailableUsers = (
  req,
  res
) => {

  db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email
    FROM users u
    LEFT JOIN subscribers s
    ON u.id = s.user_id
    WHERE s.id IS NULL
    AND u.role = 'customer'
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

exports.createSubscriber = (
  req,
  res
) => {

  const {
    user_id,
    full_name,
    address,
    street,
    barangay,
    city,
    province,
    postal_code,
    birthday,
    spouse,
    wedding_anniversary,
    contact_number,
    email,
    installation_date,
    internet_plan_id,
    cable_plan_id
  } = req.body;

  if (!internet_plan_id && !cable_plan_id) {
    return res.status(400).json({
      message: "Choose at least one plan."
    });
  }

  const id_image = req.file
    ? `/uploads/ids/${req.file.filename}`
    : null;

  const subscriber_no =
    `CCN-${Date.now()}`;
  const fullAddress = buildAddress({
    street,
    barangay,
    city,
    province,
    postal_code,
    address,
  });

  ensureSubscriberProfileColumns((schemaErr) => {
    if (schemaErr) {
      return res.status(500).json(schemaErr);
    }

    db.query(
    `
    INSERT INTO subscribers
    (
      user_id,
      subscriber_no,
      full_name,
      address,
      street,
      barangay,
      city,
      province,
      postal_code,
      birthday,
      spouse,
      wedding_anniversary,
      contact_number,
      email,
      id_image,
      installation_date,
      account_status
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    `,
    [
      user_id,
      subscriber_no,
      full_name || null,
      fullAddress,
      street || null,
      barangay || null,
      city || null,
      province || null,
      postal_code || null,
      birthday || null,
      spouse || null,
      wedding_anniversary || null,
      contact_number,
      email || null,
      id_image,
      installation_date
    ],
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      const subscriberId =
        result.insertId;

      db.query(
        `
        INSERT INTO
        subscriber_services
        (
          subscriber_id,
          internet_plan_id,
          cable_plan_id,
          start_date
        )
        VALUES
        (?, ?, ?, CURDATE())
        `,
        [
          subscriberId,
          internet_plan_id || null,
          cable_plan_id || null,
          
        ],
        (serviceErr) => {

          if (serviceErr) {
            return res
              .status(500)
              .json(serviceErr);
          }

          res.status(201).json({
            message:
              "Subscriber created successfully",
            subscriber_no,
          });

        }
      );

    }
  );
  });
};

exports.applySubscription = (
  req,
  res
) => {
  const userId = req.user.id;
  const {
    full_name,
    address,
    street,
    barangay,
    city,
    province,
    postal_code,
    birthday,
    spouse,
    wedding_anniversary,
    contact_number,
    email,
    installation_date,
    internet_plan_id,
    cable_plan_id,
  } = req.body;

  if (!internet_plan_id && !cable_plan_id) {
    return res.status(400).json({
      message:
        "Choose at least one plan to apply."
    });
  }

  db.query(
    `
    SELECT id, account_status
    FROM subscribers
    WHERE user_id = ?
      AND account_status IN ('Pending', 'Pending Installation', 'Active')
    LIMIT 1
    `,
    [userId],
    (err, existing) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (existing.length > 0) {
        return res.status(400).json({
          message:
            "You already have an active or pending application."
        });
      }

      const subscriber_no = `CCN-${Date.now()}`;
      const id_image = req.file
        ? `/uploads/ids/${req.file.filename}`
        : null;
      const fullAddress = buildAddress({
        street,
        barangay,
        city,
        province,
        postal_code,
        address,
      });

      ensureSubscriberProfileColumns((schemaErr) => {
        if (schemaErr) {
          return res.status(500).json(schemaErr);
        }

        db.query(
        `
        INSERT INTO subscribers
        (
          user_id,
          subscriber_no,
          full_name,
          address,
          street,
          barangay,
          city,
          province,
          postal_code,
          birthday,
          spouse,
          wedding_anniversary,
          contact_number,
          email,
          id_image,
          installation_date,
          account_status
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `,
        [
          userId,
          subscriber_no,
          full_name || null,
          fullAddress,
          street || null,
          barangay || null,
          city || null,
          province || null,
          postal_code || null,
          birthday || null,
          spouse || null,
          wedding_anniversary || null,
          contact_number,
          email || null,
          id_image,
          installation_date,
        ],
        (err2, result) => {
          if (err2) {
            return res.status(500).json(err2);
          }

          const subscriberId = result.insertId;

          db.query(
            `
            INSERT INTO subscriber_services
            (
              subscriber_id,
              internet_plan_id,
              cable_plan_id,
              start_date
            )
            VALUES
            (?, ?, ?, ?)
            `,
            [
              subscriberId,
              internet_plan_id || null,
              cable_plan_id || null,
              installation_date || null,
            ],
            (err3) => {
              if (err3) {
                return res.status(500).json(err3);
              }

              res.status(201).json({
                message:
                  "Subscription application submitted successfully",
                subscriber_no,
              });
            }
          );
        }
      );
      });
    }
  );
};

exports.getPendingApplications = (
  req,
  res
) => {
  db.query(
    `
    SELECT
      s.id,
      s.subscriber_no,
      s.address,
      s.street,
      s.barangay,
      s.city,
      s.province,
      s.postal_code,
      s.full_name,
      s.birthday,
      s.spouse,
      s.wedding_anniversary,
      s.contact_number,
      s.email AS application_email,
      s.id_image,
      s.installation_date AS requested_date,
      s.account_status,
      u.id AS user_id,
      u.name,
      u.email,
      ip.plan_name AS internet_plan,
      cp.plan_name AS cable_plan,
      ss.internet_plan_id,
      ss.cable_plan_id,
      ss.start_date
    FROM subscribers s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN subscriber_services ss ON ss.subscriber_id = s.id
    LEFT JOIN internet_plans ip ON ip.id = ss.internet_plan_id
    LEFT JOIN cable_plans cp ON cp.id = ss.cable_plan_id
    WHERE s.account_status = 'Pending'
    ORDER BY s.created_at DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(results);
    }
  );
};

exports.approveSubscriptionApplication = (
  req,
  res
) => {
  const applicationId = req.params.id;
  const {
    appointment_date,
    appointment_time,
  } = req.body;

  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    db.query(
      `
      UPDATE subscribers
      SET
        account_status = 'Pending Installation',
        installation_status = 'Pending',
        installation_date = ?
      WHERE id = ?
        AND account_status = 'Pending'
      `,
      [appointment_date || null, applicationId],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Application is no longer pending.",
          });
        }

        res.json({
          message: "Subscription application accepted for installation",
          appointment_time: appointment_time || null,
        });
      }
    );
  });
};

exports.declineSubscriptionApplication = (
  req,
  res
) => {
  const applicationId = req.params.id;

  db.query(
    `
    UPDATE subscribers
    SET account_status = 'Declined'
    WHERE id = ?
      AND account_status = 'Pending'
    `,
    [applicationId],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message:
          "Subscription application declined",
      });
    }
  );
};

exports.getTechnicianPendingInstallations = (req, res) => {
  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    normalizeInstallationStatuses((statusErr) => {
      if (statusErr) return res.status(500).json(statusErr);

      db.query(
        `
        ${installationSelect}
        WHERE s.account_status = 'Pending Installation'
          AND s.installation_assigned_to IS NULL
        ORDER BY s.created_at ASC
        `,
        (err, results) => {
          if (err) return res.status(500).json(err);
          res.json(results);
        }
      );
    });
  });
};

exports.getTechnicianAssignedInstallations = (req, res) => {
  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    normalizeInstallationStatuses((statusErr) => {
      if (statusErr) return res.status(500).json(statusErr);

      db.query(
        `
        ${installationSelect}
        WHERE s.installation_assigned_to = ?
        ORDER BY s.created_at DESC
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

exports.claimTechnicianInstallation = (req, res) => {
  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    db.query(
      `
      UPDATE subscribers
      SET installation_assigned_to = ?, installation_status = 'Assigned'
      WHERE id = ?
        AND account_status = 'Pending Installation'
        AND installation_assigned_to IS NULL
      `,
      [req.user.id, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Installation is not available for claim",
          });
        }
        res.json({ message: "Installation claimed successfully" });
      }
    );
  });
};

exports.updateTechnicianInstallationStatus = (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Assigned", "On-going", "Resolved"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid installation status" });
  }

  ensureSubscriberProfileColumns((columnErr) => {
    if (columnErr) return res.status(500).json(columnErr);

    const accountStatus =
      status === "Resolved" ? "Active" : "Pending Installation";

    db.query(
      `
      UPDATE subscribers
      SET installation_status = ?, account_status = ?
      WHERE id = ?
        AND installation_assigned_to = ?
      `,
      [status, accountStatus, req.params.id, req.user.id],
      (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Installation not found or not assigned to you",
          });
        }

        if (status !== "Resolved") {
          return res.json({ message: "Installation status updated" });
        }

        db.query(
          `
          UPDATE subscriber_services
          SET start_date = COALESCE(
            (SELECT installation_date FROM subscribers WHERE id = ?),
            CURDATE()
          )
          WHERE subscriber_id = ?
          `,
          [req.params.id, req.params.id],
          (serviceErr) => {
            if (serviceErr) return res.status(500).json(serviceErr);

            createInitialBillForSubscriber(req.params.id, (billErr, billResult) => {
              if (billErr) return res.status(500).json(billErr);

              res.json({
                message: billResult?.generated
                  ? "Installation resolved, subscriber activated, and first bill generated"
                  : "Installation resolved and subscriber activated",
                first_bill_generated: Boolean(billResult?.generated),
                first_bill_amount: billResult?.amount || 0,
              });
            });
          }
        );
      }
    );
  });
};

exports.getInternetPlans =
(req, res) => {

  syncOfficialPlans((syncErr) => {
    if (syncErr) {
      return res.status(500).json(syncErr);
    }

    db.query(
      `
      SELECT *
      FROM internet_plans
      WHERE speed IN ('30 Mbps', '50 Mbps', '100 Mbps', '200 Mbps')
        AND monthly_fee IN (500, 999, 1399, 1599)
      ORDER BY monthly_fee ASC
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
  });

};

exports.getCablePlans =
(req, res) => {

  syncOfficialPlans((syncErr) => {
    if (syncErr) {
      return res.status(500).json(syncErr);
    }

    db.query(
      `
      SELECT *
      FROM cable_plans
      WHERE monthly_fee = 380
      ORDER BY monthly_fee ASC
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
  });

};

exports.assignPlan = (req, res) => {

  const {
    subscriber_id,
    internet_plan_id,
    cable_plan_id,
    installation_date
  } = req.body;

  db.query(
    `
    UPDATE subscribers
    SET
      internet_plan_id = ?,
      cable_plan_id = ?,
      installation_date = ?,
      account_status = 'Active'
    WHERE id = ?
    `,
    [
      internet_plan_id,
      cable_plan_id,
      installation_date,
      subscriber_id
    ],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Subscriber activated successfully"
      });

    }
  );

};

exports.getSubscriberById =
(req, res) => {

  ensureSubscriberProfileColumns((schemaErr) => {
    if (schemaErr) {
      return res.status(500).json(schemaErr);
    }

    db.query(
    `
    SELECT

      s.*,

      u.name,
      u.email,

      ip.id AS internet_plan_id,
      ip.plan_name AS internet_plan,
      ip.speed,
      ip.monthly_fee AS internet_fee,

      cp.id AS cable_plan_id,
      cp.plan_name AS cable_plan,
      cp.monthly_fee AS cable_fee

    FROM subscribers s

    JOIN users u
    ON s.user_id = u.id

    LEFT JOIN subscriber_services ss
    ON ss.subscriber_id = s.id

    LEFT JOIN internet_plans ip
    ON ip.id = ss.internet_plan_id

    LEFT JOIN cable_plans cp
    ON cp.id = ss.cable_plan_id

    WHERE s.id = ?
    `,
    [req.params.id],
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
              "Subscriber not found"
          });
      }

      res.json(
        results[0]
      );

    }
  );
  });

};

exports.getAccountStatement =
(req, res) => {

  const subscriberId =
    req.params.id;

  db.query(
    `
    SELECT

      s.subscriber_no,

      u.name,

      u.email,

      s.address,

      s.contact_number,

      s.account_status

    FROM subscribers s

    JOIN users u
    ON u.id =
    s.user_id

    WHERE
    s.id = ?
    `,
    [subscriberId],
    (err, profile) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(
        profile[0]
      );

    }
  );

};

exports.getMyProfile =
(req, res) => {

  ensureSubscriberProfileColumns((schemaErr) => {
    if (schemaErr) {
      return res.status(500).json(schemaErr);
    }

    db.query(
    `
    SELECT

      s.*,

      u.name,
      u.email,

      ip.plan_name
      AS internet_plan,

      ip.speed,

      ip.monthly_fee
      AS internet_fee,

      cp.plan_name
      AS cable_plan,

      cp.monthly_fee
      AS cable_fee

    FROM subscribers s

    JOIN users u
    ON u.id = s.user_id

    LEFT JOIN
    subscriber_services ss
    ON ss.subscriber_id = s.id

    LEFT JOIN
    internet_plans ip
    ON ip.id =
    ss.internet_plan_id

    LEFT JOIN
    cable_plans cp
    ON cp.id =
    ss.cable_plan_id

    WHERE
    s.user_id = ?
    `,
    [req.user.id],
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
            "Subscriber not found"
          });
      }

      res.json(
        results[0]
      );

    }
  );
  });

};

exports.getDashboardSummary = (req, res) => {

  const userId = req.user.id;

  db.query(
    `
    SELECT * FROM subscribers
    WHERE user_id = ?
    `,
    [userId],
    (err, subResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      // 🚨 NOT A SUBSCRIBER YET
      if (subResult.length === 0) {

        return res.json({
          isSubscriber: false,
          message: "No active subscription"
        });

      }

      const subscriberId = subResult[0].id;

      db.query(
        `
        SELECT

          s.account_status,
          COALESCE(SUM(b.remaining_balance),0) AS outstanding_balance,
          COUNT(DISTINCT b.id) AS total_bills,
          COUNT(DISTINCT p.id) AS total_payments

        FROM subscribers s
        LEFT JOIN bills b ON b.subscriber_id = s.id
        LEFT JOIN payments p ON p.bill_id = b.id
        WHERE s.id = ?
        `,
        [subscriberId],
        (err2, result) => {

          if (err2) {
            return res.status(500).json(err2);
          }

          res.json({
            isSubscriber: true,
            ...result[0]
          });

        }
      );

    }
  );

};

exports.getMySubscriber = (req, res) => {

  const userId = req.user.id;

  db.query(
    `
    SELECT *
    FROM subscribers
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      // NOT SUBSCRIBED YET
      if (result.length === 0) {
        return res.json(null);
      }

      res.json(result[0]);

    }
  );

};

exports.updateMyAddressInfo = (req, res) => {
  const userId = req.user.id;
  const {
    address,
    street,
    barangay,
    city,
    province,
    postal_code,
    latitude,
    longitude,
  } = req.body;

  const fullAddress = buildAddress({
    street,
    barangay,
    city,
    province,
    postal_code,
    address,
  });

  if (!fullAddress) {
    return res.status(400).json({
      message: "Address is required"
    });
  }

  const houseImage = req.file
    ? `/uploads/houses/${req.file.filename}`
    : null;

  ensureSubscriberProfileColumns((schemaErr) => {
    if (schemaErr) {
      return res.status(500).json(schemaErr);
    }

    const fields = [
      "address = ?",
      "street = ?",
      "barangay = ?",
      "city = ?",
      "province = ?",
      "postal_code = ?",
      "latitude = ?",
      "longitude = ?",
    ];
    const params = [
      fullAddress,
      street || null,
      barangay || null,
      city || null,
      province || null,
      postal_code || null,
      latitude || null,
      longitude || null,
    ];

    if (houseImage) {
      fields.push("house_image = ?");
      params.push(houseImage);
    }

    params.push(userId);

    db.query(
      `
      UPDATE subscribers
      SET ${fields.join(", ")}
      WHERE user_id = ?
      LIMIT 1
      `,
      params,
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Subscriber not found"
          });
        }

        res.json({
          message: "Address information updated",
          house_image: houseImage
        });
      }
    );
  });
};
