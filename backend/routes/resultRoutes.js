import express from "express";
import {
  getElectionResult,
  getLatestStateResult,
  publishElectionResult,
} from "../controllers/resultController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/election/:electionId", getElectionResult);
router.get("/state/:stateId/latest", getLatestStateResult);
router.post("/election/:electionId/publish", authRequired, adminOnly, publishElectionResult);

export default router;
