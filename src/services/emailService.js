const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Transporter Configuration (Optimized for Render + Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // 🔥 Use SSL
  secure: true,       // required for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password
  },
  family: 4,          // 🔥 Force IPv4 (fix Render issue)
  debug: true,
  logger: true,
});

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email transporter is ready to send messages");
  }
});

// ✅ Welcome Email
async function sendWelcomeEmail(toEmail, username) {
  try {
    const result = await transporter.sendMail({
      from: `"Job Pilot" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      replyTo: process.env.EMAIL_USER,

      subject: `Welcome to Job Pilot 🎉`,

      // ✅ Plain text (VERY IMPORTANT)
      text: `Hello ${username}, welcome to Job Pilot! 🚀`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Welcome to Job Pilot 🎉</h2>
          <p>Hello <b>${username}</b>,</p>
          <p>We're excited to have you onboard 🚀</p>
        </div>
      `,
    });

    console.log("✅ Welcome email sent:", result.messageId);
    return result;

  } catch (error) {
    console.log("❌ Email error:", error.message);
    throw error;
  }
}

// ✅ OTP Email
async function sendOTPEmail(toEmail, otp) {
  try {
    const result = await transporter.sendMail({
      from: `"Job Pilot" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      replyTo: process.env.EMAIL_USER,

      // 🔥 Better subject (avoid spam trigger)
      subject: `Your JobPilot code: ${otp}`,

      // ✅ Plain text fallback (CRITICAL)
      text: `Your JobPilot verification code is ${otp}. It expires in 5 minutes.`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Verify your email</h2>

          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px;">
            <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
          </div>

          <p style="color: #666;">This code will expire in 5 minutes.</p>

          <hr/>

          <p style="font-size: 12px; color: #999;">
            If you didn’t request this, you can ignore this email.
          </p>
        </div>
      `,

      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    console.log("✅ OTP sent to:", toEmail, "| ID:", result.messageId);
    return result;

  } catch (err) {
    console.log("❌ OTP error:", err.message);
    throw err;
  }
}

module.exports = { sendWelcomeEmail, sendOTPEmail };