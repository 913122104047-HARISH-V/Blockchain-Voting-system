const jwt = require("jsonwebtoken");
const Voter = require("../models/Voter");
const Constituency = require("../models/Constituency");
const VerificationLog = require("../models/VerificationLog");
const { hashAadhaar } = require("../utils/aadhaarHash");
const { generateOtp, verifyOtp } = require("../services/otpService");
const { verifyFace } = require("../services/faceVerificationService");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function buildOtpResponse(message, otp) {
  const response = { message };
  if (process.env.ENABLE_DEMO_OTP === "true") {
    response.otp_for_demo = otp;
  }
  return response;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "12h" });
}

async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@evote.local";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const otp = await generateOtp("admin", email);
    return res.json(buildOtpResponse("OTP sent to admin email", otp));
  } catch (err) {
    return next(err);
  }
}

async function verifyAdminOtpAndFace(req, res, next) {
  try {
    const { email, otp, faceToken } = req.body;
    const isOtpValid = await verifyOtp("admin", email, otp);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const expectedFaceToken = process.env.ADMIN_FACE_TOKEN || "admin-face-token";
    if (String(faceToken || "") !== expectedFaceToken) {
      return res.status(401).json({ message: "Face verification failed" });
    }

    const token = signToken({ role: "admin", email });
    return res.json({ message: "Admin authenticated", token });
  } catch (err) {
    return next(err);
  }
}

async function voterInitLogin(req, res, next) {
  try {
    const { aadhaar_number } = req.body;
    const aadhaar_hash = hashAadhaar(aadhaar_number);
    const voter = await Voter.findOne({
      aadhaar_hash,
      is_active: true,
      voter_status: "eligible",
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found or not eligible" });
    }

    const otp = await generateOtp("voter", voter._id.toString());
    return res.json({
      ...buildOtpResponse("OTP sent to registered contact", otp),
      voter_id: voter._id,
    });
  } catch (err) {
    return next(err);
  }
}

async function verifyVoterOtpAndFace(req, res, next) {
  try {
    const { voter_id, otp, face_embedding } = req.body;
    const voter = await Voter.findById(voter_id);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const isOtpValid = await verifyOtp("voter", voter._id.toString(), otp);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const faceOk = verifyFace({
      inputFaceEmbedding: face_embedding,
      storedFaceEmbedding: voter.face_embedding,
    });
    if (!faceOk) {
      return res.status(401).json({ message: "Face verification failed" });
    }

    const constituency = await Constituency.findById(voter.constituency_id);
    if (!constituency) {
      return res.status(400).json({ message: "Voter constituency mapping missing" });
    }

    voter.hasCompletedKYC = true;
    await voter.save();

    await VerificationLog.create({
      voter_id: voter._id,
      otp_verified: true,
      face_verified: true,
      ip_address: req.ip,
      device_info: req.headers["user-agent"] || "",
    });

    const token = signToken({
      role: "voter",
      voterId: voter._id.toString(),
      constituencyId: voter.constituency_id.toString(),
      stateId: constituency.state_id.toString(),
    });
    return res.json({ message: "Voter authenticated", token });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  adminLogin,
  verifyAdminOtpAndFace,
  voterInitLogin,
  verifyVoterOtpAndFace,
};
