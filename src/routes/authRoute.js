const express = require("express");
const {registerUser, verifyOTP, resendOTP, loginUser, getUserProfile, updateUserProfile} = require("../controllers/authController.js");
const { uploadImage } = require("../middleware/uploadMiddleware.js");
const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup" , registerUser);
router.post("/login" , loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, uploadImage.single("profilePic"), updateUserProfile);
router.post("/verify-otp" , verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;