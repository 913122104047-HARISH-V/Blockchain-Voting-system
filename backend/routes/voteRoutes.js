import express from "express";
import { submitVote } from "../controllers/votingController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { voterOnly } from "../middleware/voterMiddleware.js";

const router = express.Router();

router.post("/", authRequired, voterOnly, submitVote);

export default router;
