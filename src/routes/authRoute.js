const express = require("express");
const {registerUser, loginUser, getUserProfile} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup" , registerUser);
router.post("/login" , loginUser);
router.get("/profile", require("../middleware/authMiddleware.js"), getUserProfile);

module.exports = router;