const express = require("express");
const { submitVote } = require("../controllers/votingController");
const { authRequired } = require("../middleware/authMiddleware");
const { voterOnly } = require("../middleware/voterMiddleware");

const router = express.Router();

router.post("/", authRequired, voterOnly, submitVote);

module.exports = router;
