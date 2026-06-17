const dotenv = require('dotenv');
dotenv.config();

const { sendOTPEmail, sendWelcomeEmail } = require('./services/emailService');

const to = process.argv[2];
const otp = process.argv[3] || '123456';

if (!to) {
  console.log('Usage: node src/testSendEmail.js recipient@example.com [otp]');
  process.exit(1);
}

(async () => {
  try {
    await sendOTPEmail(to, otp);
    console.log('Test send attempted. Check console for success/error details.');
  } catch (err) {
    console.error('Test send failed:', err);
  }
})();
