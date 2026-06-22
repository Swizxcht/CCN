const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createServiceRequest,
  getMyRequests,
  getAllServiceRequests,
  getAssignedRequests,
  getPendingRequests,
  claimRequest,
  getTechnicians,
  assignTechnician,
  updateRequestStatus,
  updateAssignedRequestStatus
} = require("../controllers/serviceRequestController");

// CUSTOMER
router.post("/", auth, createServiceRequest);
router.get("/my", auth, getMyRequests);

// ADMIN
router.get("/", auth, role("admin"), getAllServiceRequests);
router.get("/technicians", auth, role("admin"), getTechnicians);
router.put("/assign", auth, role("admin"), assignTechnician);
router.put("/:id", auth, role("admin"), updateRequestStatus);

// TECHNICIAN
router.get("/pending", auth, role("technician"), getPendingRequests);
router.put("/pending/:id/claim", auth, role("technician"), claimRequest);
router.get("/assigned", auth, role("technician"), getAssignedRequests);
router.put("/assigned/:id/status", auth, role("technician"), updateAssignedRequestStatus);

module.exports = router;












// const express =
//   require("express");

// const router =
//   express.Router();

// const authMiddleware =
//   require(
//     "../middleware/authMiddleware"
//   );

// const roleMiddleware =
//   require(
//     "../middleware/roleMiddleware"
//   );

// const {
//   createRequest,
//   getMyRequests,
//   getAllRequests,
//   updateStatus,
// } = require(
//   "../controllers/serviceRequestController"
// );

// router.post(
//   "/",
//   authMiddleware,
//   createRequest
// );

// router.get(
//   "/my",
//   authMiddleware,
//   getMyRequests
// );

// router.get(
//   "/",
//   authMiddleware,
//   roleMiddleware("admin"),
//   getAllRequests
// );

// router.put(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("admin"),
//   updateStatus
// );

// module.exports =
//   router;