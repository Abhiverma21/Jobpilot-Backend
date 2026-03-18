const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
    },
    // Add connection verification
    debug: true,
    logger: true
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email transporter verification failed:", error);
    } else {
        console.log("✅ Email transporter is ready to send messages");
    }
});

async function sendWelcomeEmail(toEmail, username){
  try {
    await transporter.sendMail({
      from: `"Job Pilot" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome 🎉",
      text: `Hello ${username}, welcome to Job Pilot! 🚀`,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Email error:", error.message);
    throw error; // Re-throw to handle in calling function
  }
};

async function sendOTPEmail(toEmail , otp){
  try{
    const result = await transporter.sendMail({
      from: `"Job Pilot" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Verification Code - Job Pilot",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP Verification Code</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; text-align: center;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Job Pilot - Your AI-Powered Job Application Assistant</p>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log("✅ OTP sent to:", toEmail, "Message ID:", result.messageId);
    return result; // Return the result for debugging

  }catch(err){
    console.log("❌ OTP error:", err.message);
    throw err; // Re-throw to handle in calling function
  }
}


module.exports = {sendWelcomeEmail , sendOTPEmail};