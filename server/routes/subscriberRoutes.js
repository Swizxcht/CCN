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

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const idUploadDir = path.join(__dirname, "..", "uploads", "ids");
const houseUploadDir = path.join(__dirname, "..", "uploads", "houses");
fs.mkdirSync(idUploadDir, { recursive: true });
fs.mkdirSync(houseUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === "house_image" ? houseUploadDir : idUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === "house_image" ? "house" : "id";
    cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

const {
  getSubscribers,
  getAvailableUsers,
  createSubscriber,
  getInternetPlans,
  getCablePlans,
  assignPlan,
  getSubscriberById,
  getAccountStatement,
  getMyProfile,
  getDashboardSummary,
  getMySubscriber,
  updateMyAddressInfo,
  applySubscription,
  getPendingApplications,
  approveSubscriptionApplication,
  declineSubscriptionApplication,
  getTechnicianPendingInstallations,
  getTechnicianAssignedInstallations,
  claimTechnicianInstallation,
  updateTechnicianInstallationStatus,
} = require(
"../controllers/subscriberController"
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getSubscribers
);

router.get(
  "/available-users",
  authMiddleware,
  roleMiddleware("admin"),
  getAvailableUsers
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("id_image"),
  createSubscriber
);

router.get(
  "/internet-plans",
  authMiddleware,
  getInternetPlans
);

router.get(
  "/cable-plans",
  authMiddleware,
  getCablePlans
);

router.put(
  "/assign-plan",
  authMiddleware,
  roleMiddleware("admin"),
  assignPlan
);
router.get(
  "/statement/:id",
  authMiddleware,
  getAccountStatement
);

router.get(
  "/me/profile",
  authMiddleware,
  getMyProfile
);

router.get(
  "/me/dashboard",
  authMiddleware,
  getDashboardSummary
);

router.post(
  "/apply",
  authMiddleware,
  roleMiddleware("customer"),
  upload.single("id_image"),
  applySubscription
);

router.get(
  "/pending-applications",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingApplications
);

router.put(
  "/pending-applications/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveSubscriptionApplication
);

router.put(
  "/pending-applications/:id/decline",
  authMiddleware,
  roleMiddleware("admin"),
  declineSubscriptionApplication
);

router.get(
  "/technician/installations/pending",
  authMiddleware,
  roleMiddleware("technician"),
  getTechnicianPendingInstallations
);

router.put(
  "/technician/installations/pending/:id/claim",
  authMiddleware,
  roleMiddleware("technician"),
  claimTechnicianInstallation
);

router.get(
  "/technician/installations/assigned",
  authMiddleware,
  roleMiddleware("technician"),
  getTechnicianAssignedInstallations
);

router.put(
  "/technician/installations/assigned/:id/status",
  authMiddleware,
  roleMiddleware("technician"),
  updateTechnicianInstallationStatus
);

router.get(
  "/me",
  authMiddleware,
  getMySubscriber
);

router.put(
  "/me/address",
  authMiddleware,
  roleMiddleware("customer"),
  upload.single("house_image"),
  updateMyAddressInfo
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getSubscriberById
);



module.exports = router;
