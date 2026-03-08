const crypto = require("crypto");
const OtpToken = require("../models/OtpToken");

const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 5 * 60 * 1000);

function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

async function generateOtp(scope, id) {
  const otp = String(crypto.randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await OtpToken.findOneAndUpdate(
    {
      scope,
      subject_id: String(id),
    },
    {
      scope,
      subject_id: String(id),
      otp_hash: hashOtp(otp),
      expires_at: expiresAt,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return otp;
}

async function verifyOtp(scope, id, submittedOtp) {
  const record = await OtpToken.findOne({
    scope,
    subject_id: String(id),
  });

  if (!record) {
    return false;
  }

  if (Date.now() > record.expires_at.getTime()) {
    await OtpToken.deleteOne({ _id: record._id });
    return false;
  }

  const ok = hashOtp(submittedOtp) === record.otp_hash;
  if (ok) {
    await OtpToken.deleteOne({ _id: record._id });
  }

  return ok;
}

module.exports = {
  generateOtp,
  verifyOtp,
};
