import express from "express";
import { getVoterDashboard, bindWallet } from "../controllers/voterController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { voterOnly } from "../middleware/voterMiddleware.js";

const router = express.Router();

router.use(authRequired, voterOnly);
router.get("/dashboard", getVoterDashboard);
router.post("/bind-wallet", bindWallet);

export default router;
