import express from "express";
import {
  createElection,
  listElections,
  updateElectionStatus,
  getActiveElectionForState,
} from "../controllers/electionController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", listElections);
router.get("/active/:stateId", getActiveElectionForState);
router.post("/", authRequired, adminOnly, createElection);
router.patch("/:id/status", authRequired, adminOnly, updateElectionStatus);

export default router;
