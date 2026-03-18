const express = require("express");
const {registerUser, verifyOTP, resendOTP, loginUser, getUserProfile} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup" , registerUser);
router.post("/login" , loginUser);
router.get("/profile", require("../middleware/authMiddleware.js"), getUserProfile);
router.post("/verify-otp" , verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;