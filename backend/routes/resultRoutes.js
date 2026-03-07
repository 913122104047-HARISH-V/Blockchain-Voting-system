const express = require("express");
const { getElectionResult, getLatestStateResult } = require("../controllers/resultController");

const router = express.Router();

router.get("/election/:electionId", getElectionResult);
router.get("/state/:stateId/latest", getLatestStateResult);

module.exports = router;
