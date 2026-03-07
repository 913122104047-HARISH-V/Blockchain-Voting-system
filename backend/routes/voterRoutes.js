const express = require("express");
const { getVoterDashboard, bindWallet } = require("../controllers/voterController");
const { authRequired } = require("../middleware/authMiddleware");
const { voterOnly } = require("../middleware/voterMiddleware");

const router = express.Router();

router.use(authRequired, voterOnly);
router.get("/dashboard", getVoterDashboard);
router.post("/bind-wallet", bindWallet);

module.exports = router;
