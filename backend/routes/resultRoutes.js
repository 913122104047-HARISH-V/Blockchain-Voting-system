const express = require("express");
const {
  getElectionResult,
  getLatestStateResult,
  publishElectionResult,
} = require("../controllers/resultController");
const { authRequired } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/election/:electionId", getElectionResult);
router.get("/state/:stateId/latest", getLatestStateResult);
router.post("/election/:electionId/publish", authRequired, adminOnly, publishElectionResult);

module.exports = router;
