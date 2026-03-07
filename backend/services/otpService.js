const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 5 * 60 * 1000);
const otpStore = new Map();

function makeKey(scope, id) {
  return `${scope}:${id}`;
}

function generateOtp(scope, id) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const key = makeKey(scope, id);
  otpStore.set(key, { otp, expiresAt: Date.now() + OTP_TTL_MS });
  return otp;
}

function verifyOtp(scope, id, submittedOtp) {
  const key = makeKey(scope, id);
  const record = otpStore.get(key);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  const ok = String(submittedOtp) === record.otp;
  if (ok) otpStore.delete(key);
  return ok;
}

module.exports = {
  generateOtp,
  verifyOtp,
};
