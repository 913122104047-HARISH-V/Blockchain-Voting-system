const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// controllers/authController.js
const { User } =require("../models/user.js");
const { Election} =require("../models/election.js");
const { Candidate } =require("../models/candidate.js");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to user email
exports.loginWithAadhaar = async (req, res) => {
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
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { aadharNumber, otp } = req.body;
 // console.log(req.body);
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
      { id: user._id, aadharNumber: user.aadharNumber, role: "voter" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1️⃣ — Fetch user by ID
    const user = await User.findById(userId)
      .populate("electionId", "title status startDate endDate")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2️⃣ — Ensure OTP and Face are verified
    if (!user.isVerified || !user.isFaceVerified) {
      return res.status(403).json({
        message:
          "Access denied. Please complete OTP and Face authentication first.",
      });
    }

    // Step 3️⃣ — Get related election & candidates if assigned
    let electionDetails = null;
    let candidatesList = [];

    if (user.electionId) {
      electionDetails = await Election.findById(user.electionId).lean();

      candidatesList = await Candidate.find({
        electionId: user.electionId,
      }).select("name party symbol voteCount");
    }

    // Step 4️⃣ — Construct dashboard response
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        aadhaarNumber: user.aadhaarNumber,
        walletAddress: user.walletAddress,
        hasVoted: user.hasVoted,
      },
      election: electionDetails
        ? {
            title: electionDetails.title,
            status: electionDetails.status,
            startDate: electionDetails.startDate,
            endDate: electionDetails.endDate,
          }
        : null,
      candidates: candidatesList,
      message: user.hasVoted
        ? "You have already voted."
        : "You can now cast your vote.",
    };

    // Step 5️⃣ — Send success response
    return res.status(200).json({
      success: true,
      dashboard: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading dashboard",
    });
  }
};



// Step 4: Get logged-in user details
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

