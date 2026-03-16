import express from "express";
import { addCandidate, listCandidates } from "../controllers/candidateController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", listCandidates);
router.post("/", authRequired, adminOnly, addCandidate);

export default router;
