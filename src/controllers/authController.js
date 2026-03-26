const User = require("../models/User.js");
const cloudinary = require("../utils/cloudinary.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP.js");
const {
  sendOTPEmail,
} = require("../services/emailService.js");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isverified: false,
    });

    sendOTPEmail(email, otp);

    res.status(201).json({ message: "OTP sent" });
  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isverified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP resent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: " OTP Expired" });
    }

    user.isverified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    return res.status(500).json({message:"Server Error"})
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(400).json({ message: "User not exists" });
    }
    const isMatch = await bcrypt.compare(password, existedUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if(!existedUser.isverified){
      return res.status(400).json({ message: "Please verify your email first " });
    }
    const token = jwt.sign({ id: existedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      _id: existedUser._id,
      username: existedUser.username,
      email: existedUser.email,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone : user.phone,
      bio : user.bio,
      location : user.location,
      profilePic : user.profilePic,
      skills : user.skills
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, phone, bio, location, profilePic, skills } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (skills) user.skills = skills;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, phone, bio, location } = req.body;

    let skills = [];
    if (req.body.skills) {
      skills = JSON.parse(req.body.skills);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // profile image upload
    if (req.file) {
      // Upload buffer directly to cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "job-tracker-profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      user.profilePic = result.secure_url;
    }

    if (username) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (skills.length > 0) {
      user.skills = skills;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};