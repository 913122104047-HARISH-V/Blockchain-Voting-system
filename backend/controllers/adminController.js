const State = require("../models/State");
const Constituency = require("../models/Constituency");
const Voter = require("../models/Voter");
const Party = require("../models/Party");
const { calculateMajorityMark } = require("../utils/majorityCalculator");
const { hashAadhaar } = require("../utils/aadhaarHash");
const { createConstituencyOnChain } = require("../services/blockchainService");
const Election = require("../models/Election");

async function recalculateStateCounts(stateId) {
  const total = await Constituency.countDocuments({ state_id: stateId });
  const majority = total > 0 ? calculateMajorityMark(total) : 0;
  await State.findByIdAndUpdate(stateId, {
    total_constituencies: total,
    majority_mark: majority,
  });
}

async function createState(req, res, next) {
  try {
    const { name } = req.body;
    const state = await State.create({ name });
    return res.status(201).json(state);
  } catch (err) {
    return next(err);
  }
}

async function listStates(_req, res, next) {
  try {
    const states = await State.find({}).sort({ name: 1 });
    return res.json(states);
  } catch (err) {
    return next(err);
  }
}

async function createConstituency(req, res, next) {
  try {
    const { state_id, name, total_voters } = req.body;
    const state = await State.findById(state_id);
    if (!state) return res.status(404).json({ message: "State not found" });

    const { onChainId } = await createConstituencyOnChain({
      name,
      stateName: state.name,
    });

    const constituency = await Constituency.create({
      state_id,
      on_chain_id: onChainId,
      name,
      total_voters: total_voters || 0,
    });

    await recalculateStateCounts(state_id);
    return res.status(201).json(constituency);
  } catch (err) {
    return next(err);
  }
}

async function listConstituencies(req, res, next) {
  try {
    const filter = {};
    if (req.query.state_id) filter.state_id = req.query.state_id;
    const constituencies = await Constituency.find(filter).sort({ name: 1 });
    return res.json(constituencies);
  } catch (err) {
    return next(err);
  }
}

async function addPermanentVoter(req, res, next) {
  try {
    const {
      name,
      dob,
      gender,
      constituency_id,
      aadhaar_number,
      email,
      mobile,
      face_embedding,
    } = req.body;

    const constituency = await Constituency.findById(constituency_id);
    if (!constituency) return res.status(404).json({ message: "Constituency not found" });

    const voter = await Voter.create({
      name,
      dob,
      gender,
      constituency_id,
      aadhaar_number,
      aadhaar_hash: null,
      email,
      mobile,
      face_embedding,
      hasCompletedKYC: false,
      voter_status: "eligible",
      is_active: true,
    });

    constituency.total_voters += 1;
    await constituency.save();

    return res.status(201).json(voter);
  } catch (err) {
    return next(err);
  }
}

async function createParty(req, res, next) {
  try {
    const { election_id, name, symbol } = req.body;
    const election = await Election.findById(election_id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const party = await Party.create({
      election_id,
      name,
      symbol: symbol || name,
    });
    return res.status(201).json(party);
  } catch (err) {
    return next(err);
  }
}

async function listParties(req, res, next) {
  try {
    const filter = {};
    if (req.query.election_id) {
      filter.election_id = req.query.election_id;
    }
    const parties = await Party.find(filter).sort({ name: 1 });
    return res.json(parties);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createState,
  listStates,
  createConstituency,
  listConstituencies,
  addPermanentVoter,
  createParty,
  listParties,
};
