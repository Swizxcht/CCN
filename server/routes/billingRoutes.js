const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
"../middleware/authMiddleware"
);

const roleMiddleware =
require(
"../middleware/roleMiddleware"
);

const {
  generateBill,
  getBills,
  getSubscriberBills,
  generateMonthlyBills,
  updateOverdueBills,
  getMyBills,
  getBillingHistory
} = require(
"../controllers/billingController"
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getBills
);

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("admin"),
  generateBill
);

router.post(
  "/generate-all",
  authMiddleware,
  roleMiddleware("admin"),
  generateMonthlyBills
);

router.get(
  "/subscriber/:id",
  authMiddleware,
  getSubscriberBills
);

router.put(
  "/update-overdue",
  authMiddleware,
  roleMiddleware("admin"),
  updateOverdueBills
);

router.get(
  "/my-bills",
  authMiddleware,
  getMyBills
);

router.get(
  "/history/:subscriber_id",
  authMiddleware,
  roleMiddleware("admin"),
  getBillingHistory
);

module.exports =
router;