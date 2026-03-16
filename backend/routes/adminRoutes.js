import express from "express";
import {
  createState,
  listStates,
  createConstituency,
  listConstituencies,
  addPermanentVoter,
  createParty,
  listParties,
} from "../controllers/adminController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authRequired, adminOnly);

router.post("/states", createState);
router.get("/states", listStates);
router.post("/constituencies", createConstituency);
router.get("/constituencies", listConstituencies);
router.post("/voters", addPermanentVoter);
router.post("/parties", createParty);
router.get("/parties", listParties);

export default router;
