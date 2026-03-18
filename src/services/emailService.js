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
    await transporter.sendMail({
      from: `"Job Pilot" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "OTP Verification",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>Valid for 5 minutes</p>
      `,
    })
     console.log("✅ OTP sent");

  }catch(err){
    console.log("❌ OTP error:", err.message);
    throw err; // Re-throw to handle in calling function
  }
}


module.exports = {sendWelcomeEmail , sendOTPEmail};