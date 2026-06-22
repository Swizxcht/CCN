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
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus,
} = require(
  "../controllers/customerController"
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCustomer
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getCustomers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getCustomer
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCustomer
);

router.put(
  "/status/:id",
  authMiddleware,
  roleMiddleware("admin"),
  toggleCustomerStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCustomer
);

module.exports =
  router;