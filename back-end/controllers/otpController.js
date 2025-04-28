const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

const senderEmail = process.env.EMAIL_USER;
const senderPass = process.env.EMAIL_PASS;

// Function to generate OTP
function generateOTP(length) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/*
const crypto = require('crypto');
function generateSecureOTP(length) {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}*/


// Function to send email
async function sendEmail(to, subject, body) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPass,
    },
  });

  const mailOptions = {
    from: senderEmail,
    to,
    subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
}

// Controller function to send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP(6);
    //const otpExpiry = Date.now() + 10 * 60 * 1000;

    //user.resetOtp = otp;
    //user.resetOtpExpiry = otpExpiry;
    //await user.save();

    const subject = 'Password Reset OTP - Video Call Application';
    const body = `Dear ${user.firstName} ${user.lastName},\n\n` +
      `Use the following OTP: ${otp}\n\n` +
      `Valid for 10 minutes.\n\nRegards,\nVideo Call App Team`;

    await sendEmail(email, subject, body);

    res.status(200).json({ message: 'OTP sent to email', otp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // Hash the password automatically via pre-save middleware
    await user.save();

    //otpCache.delete(email); // Clear the OTP from cache after successful reset
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password', error });
  }
};

// Controller function to verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error });
  }
};

module.exports = {
  sendOtp,
  resetPassword,
};