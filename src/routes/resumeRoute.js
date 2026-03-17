const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");
const {uploadResume, getResume, deleteResume} = require("../controllers/resumeController.js");

const router = express.Router();

router.post("/uploadresume",protect,upload.single("resume"), uploadResume);
router.get("/getresume",protect, getResume);
router.delete("/deleteresume",protect, deleteResume);

module.exports = router;