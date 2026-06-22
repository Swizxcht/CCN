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

  recordPayment,

  getPayments,

  getSubscriberPayments,

  getOutstandingBalance,

  getUnpaidBills,

    getBalanceSummary,
    getMyPayments,

} = require(
"../controllers/paymentController"
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getPayments
);

router.post(
  "/",
  authMiddleware,
  recordPayment
);

router.get(
  "/subscriber/:id",
  authMiddleware,
  getSubscriberPayments
);

router.get(
  "/balance/:id",
  authMiddleware,
  getOutstandingBalance
);

router.get(
  "/unpaid-bills",
  authMiddleware,
  getUnpaidBills
);

router.get(
  "/summary/:id",
  authMiddleware,
  getBalanceSummary
);

router.get(
  "/my-payments",
  authMiddleware,
  getMyPayments
);

module.exports =
router;