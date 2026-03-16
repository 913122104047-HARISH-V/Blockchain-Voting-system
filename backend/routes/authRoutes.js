import express from "express";
import {
  adminLogin,
  verifyAdminOtpAndFace,
  voterInitLogin,
  verifyVoterOtpAndFace,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/admin/verify", verifyAdminOtpAndFace);
router.post("/voter/login", voterInitLogin);
router.post("/voter/verify", verifyVoterOtpAndFace);

export default router;
