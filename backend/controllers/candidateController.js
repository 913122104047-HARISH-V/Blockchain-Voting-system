const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
const ElectionConstituency = require("../models/ElectionConstituency");
const Party = require("../models/Party");

async function addCandidate(req, res, next) {
  try {
    const { election_id, constituency_id, name, party_id, symbol, wallet_address } = req.body;
    const election = await Election.findById(election_id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const ec = await ElectionConstituency.findOne({
      election_id,
      constituency_id,
      status: "active",
    });
    if (!ec) return res.status(400).json({ message: "Constituency is not active for this election" });

    if (party_id) {
      const party = await Party.findById(party_id);
      if (!party) return res.status(404).json({ message: "Party not found" });
    }

    const candidate = await Candidate.create({
      election_id,
      constituency_id,
      name,
      party_id: party_id || null,
      symbol,
      wallet_address,
      is_active: true,
    });

    return res.status(201).json(candidate);
  } catch (err) {
    return next(err);
  }
}

async function listCandidates(req, res, next) {
  try {
    const filter = {};
    if (req.query.election_id) filter.election_id = req.query.election_id;
    if (req.query.constituency_id) filter.constituency_id = req.query.constituency_id;

    const candidates = await Candidate.find(filter)
      .populate("party_id", "name symbol")
      .sort({ created_at: 1 });

    return res.json(candidates);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addCandidate,
  listCandidates,
};
