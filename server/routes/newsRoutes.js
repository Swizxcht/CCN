const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

const newsUploadDir = path.join(__dirname, "..", "uploads", "news");
fs.mkdirSync(newsUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `news-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
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

router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("image"), createNews);
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.single("image"), updateNews);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteNews);

module.exports = router;
