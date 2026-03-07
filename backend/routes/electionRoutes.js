const express = require("express");
const {
  createElection,
  listElections,
  updateElectionStatus,
  getActiveElectionForState,
} = require("../controllers/electionController");
const { authRequired } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", listElections);
router.get("/active/:stateId", getActiveElectionForState);
router.post("/", authRequired, adminOnly, createElection);
router.patch("/:id/status", authRequired, adminOnly, updateElectionStatus);

module.exports = router;
