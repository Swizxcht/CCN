const express = require("express");
const db = require("../config/db");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    db.query(
      `
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers,
        (SELECT COUNT(*) FROM users WHERE role = 'technician') AS technicians,
        (SELECT COUNT(*) FROM subscribers WHERE account_status = 'Active') AS active_subscribers,
        (SELECT COUNT(*) FROM subscribers WHERE account_status = 'Pending') AS pending_applications,
        (SELECT COUNT(*) FROM service_requests) AS service_requests,
        (SELECT COUNT(*) FROM service_requests WHERE status = 'Pending') AS pending_requests,
        (SELECT COUNT(*) FROM news) AS news,
        (SELECT COUNT(*) FROM bills) AS bills,
        (SELECT COUNT(*) FROM bills WHERE status != 'Paid') AS unpaid_bills,
        (SELECT COUNT(*) FROM payments) AS payments,
        (SELECT COALESCE(SUM(remaining_balance), 0) FROM bills WHERE status != 'Paid') AS outstanding_balance
      `,
      (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }

        const summary = results[0] || {
          users: 0,
          customers: 0,
          technicians: 0,
          active_subscribers: 0,
          pending_applications: 0,
          service_requests: 0,
          pending_requests: 0,
          news: 0,
          bills: 0,
          unpaid_bills: 0,
          payments: 0,
          outstanding_balance: 0,
        };

        res.json(summary);
      }
    );
  }
);

module.exports = router;
