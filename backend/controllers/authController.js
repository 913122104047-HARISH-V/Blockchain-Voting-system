import jwt from "jsonwebtoken";
import Voter from "../models/Voter.js";
import Constituency from "../models/Constituency.js";
import VerificationLog from "../models/VerificationLog.js";
import { hashAadhaar } from "../utils/aadhaarHash.js";
import { generateOtp, verifyOtp } from "../services/otpService.js";
import { verifyFace } from "../services/faceVerificationService.js";
import { sendEmail } from "../services/emailService.js";

function getJwtSecret() {
  // Fall back to a static secret to avoid runtime errors in dev/demo mode.
  return process.env.JWT_SECRET || "dev-static-jwt-secret";
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
    const adminEmail = process.env.ADMIN_EMAIL || "votingapplication004@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const otp = await generateOtp("admin", email);

    // Send OTP to the provided admin email
    sendEmail({
      to: email,
      subject: "Your Admin OTP",
      text: `Your OTP is ${otp}. It will expire in ${Math.floor(
        Number(process.env.OTP_TTL_MS || 5 * 60 * 1000) / 1000
      )} seconds.`,
    }).catch((err) => {
      console.error("Admin OTP email send failed", err?.message || err);
    });

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
    const normalized = String(aadhaar_number || "").trim();
    const voter = await Voter.findOne({
      is_active: true,
      voter_status: "eligible",
      $or: [
        { aadhaar_number: normalized },
        { aadhaar_hash: normalized ? hashAadhaar(normalized) : null },
      ],
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found or not eligible" });
    }

    const otp = await generateOtp("voter", voter._id.toString());

    // fire-and-forget email sending; log but don't block login on mail failures
    const recipient = voter.email || voter.mobile || null;
    if (recipient) {
      sendEmail({
        to: voter.email,
        subject: "Your BlockVote OTP",
        text: `Your OTP is ${otp}. It will expire in ${Math.floor(
          Number(process.env.OTP_TTL_MS || 5 * 60 * 1000) / 1000
        )} seconds.`,
      }).catch((err) => {
        console.error("OTP email send failed", err?.message || err);
      });
    }

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
    const { voter_id, otp, faceToken } = req.body;
    const voter = await Voter.findById(voter_id);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    const isOtpValid = await verifyOtp("voter", voter._id.toString(), otp);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const expectedFaceToken = process.env.VOTER_FACE_TOKEN || "voter-face-token";
    if (String(faceToken || "") !== expectedFaceToken) {
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

export {
  adminLogin,
  verifyAdminOtpAndFace,
  voterInitLogin,
  verifyVoterOtpAndFace,
};
