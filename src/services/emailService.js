const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv = require("dotenv");
dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
  email: process.env.EMAIL_USER,
  name: "Job Pilot",
};

async function sendWelcomeEmail(toEmail, username) {
  const receivers = [
    {
      email: toEmail,
    },
  ];

  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Welcome 🎉",
      htmlContent: `<p>Hello ${username}, welcome to our platform! 🚀</p>`,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Email error:", error.response?.body || error.message);
  }
}

async function sendOTPEmail(toEmail, otp) {
  const receivers = [
    {
      email: toEmail,
    },
  ];

  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "OTP Verification",
      htmlContent: `
        <h2>Your OTP is: ${otp}</h2>
        <p>Valid for 5 minutes</p>
      `,
    });

    console.log("✅ OTP sent");
  } catch (error) {
    console.log("❌ OTP error:", error.response?.body || error.message);
  }
}

module.exports = { sendWelcomeEmail, sendOTPEmail };