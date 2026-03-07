const express = require("express");
const { addCandidate, listCandidates } = require("../controllers/candidateController");
const { authRequired } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", listCandidates);
router.post("/", authRequired, adminOnly, addCandidate);

module.exports = router;
