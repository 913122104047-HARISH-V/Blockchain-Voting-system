const express = require("express");
const {
  createState,
  listStates,
  createConstituency,
  listConstituencies,
  addPermanentVoter,
  createParty,
  listParties,
} = require("../controllers/adminController");
const { authRequired } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authRequired, adminOnly);

router.post("/states", createState);
router.get("/states", listStates);
router.post("/constituencies", createConstituency);
router.get("/constituencies", listConstituencies);
router.post("/voters", addPermanentVoter);
router.post("/parties", createParty);
router.get("/parties", listParties);

module.exports = router;
