const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to user email
exports.sendOTP = async (req, res) => {
  const { aadharNumber } = req.body;
  console.log(aadharNumber);

  try {
    const user = await User.findOne({ aadharNumber });
    if (!user) return res.status(404).json({ message: "Aadhaar not registered" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 mins
    await user.save();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Login",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { aadharNumber, otp } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ aadharNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, aadharNumber: user.aadharNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
