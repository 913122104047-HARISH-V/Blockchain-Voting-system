const express = require("express");
const {
  adminLogin,
  verifyAdminOtpAndFace,
  voterInitLogin,
  verifyVoterOtpAndFace,
} = require("../controllers/authController");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/admin/verify", verifyAdminOtpAndFace);
router.post("/voter/login", voterInitLogin);
router.post("/voter/verify", verifyVoterOtpAndFace);

module.exports = router;
