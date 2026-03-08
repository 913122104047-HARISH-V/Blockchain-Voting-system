const State = require("../models/State");
const Election = require("../models/Election");
const Constituency = require("../models/Constituency");
const ElectionConstituency = require("../models/ElectionConstituency");
const {
  createElectionOnChain,
  startElectionOnChain,
  endElectionOnChain,
} = require("../services/blockchainService");

async function createElection(req, res, next) {
  try {
    const { state_id, title, start_time, end_time, status } = req.body;
    const state = await State.findById(state_id);
    if (!state) return res.status(404).json({ message: "State not found" });

    const { onChainId } = await createElectionOnChain({
      title,
      stateName: state.name,
      startTime: start_time,
      endTime: end_time,
    });

    const election = await Election.create({
      state_id,
      on_chain_id: onChainId,
      title,
      start_time,
      end_time,
      status: status || "scheduled",
      created_by_admin: req.user.email || "admin",
    });

    const constituencies = await Constituency.find({ state_id }).select("_id");
    if (constituencies.length > 0) {
      await ElectionConstituency.insertMany(
        constituencies.map((c) => ({
          election_id: election._id,
          constituency_id: c._id,
          status: "active",
        }))
      );
    }

    if ((status || "scheduled") === "active" && onChainId) {
      await startElectionOnChain(onChainId);
    }

    return res.status(201).json(election);
  } catch (err) {
    return next(err);
  }
}

async function listElections(req, res, next) {
  try {
    const filter = {};
    if (req.query.state_id) filter.state_id = req.query.state_id;
    if (req.query.status) filter.status = req.query.status;

    const elections = await Election.find(filter).sort({ created_at: -1 });
    return res.json(elections);
  } catch (err) {
    return next(err);
  }
}

async function updateElectionStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    if (status === "active") {
      const previouslyActiveElections = await Election.find({
        state_id: election.state_id,
        status: "active",
        _id: { $ne: election._id },
      });

      for (const activeElection of previouslyActiveElections) {
        if (activeElection.on_chain_id) {
          await endElectionOnChain(activeElection.on_chain_id);
        }
      }

      await Election.updateMany(
        {
          state_id: election.state_id,
          status: "active",
          _id: { $ne: election._id },
        },
        { $set: { status: "completed" } }
      );

      if (election.on_chain_id) {
        await startElectionOnChain(election.on_chain_id);
      }
    }

    if (status === "completed" && election.on_chain_id) {
      await endElectionOnChain(election.on_chain_id);
    }

    election.status = status;
    await election.save();
    return res.json(election);
  } catch (err) {
    return next(err);
  }
}

async function getActiveElectionForState(req, res, next) {
  try {
    const { stateId } = req.params;
    const election = await Election.findOne({
      state_id: stateId,
      status: "active",
    }).sort({ start_time: -1 });

    if (!election) return res.status(404).json({ message: "No active election for state" });
    return res.json(election);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createElection,
  listElections,
  updateElectionStatus,
  getActiveElectionForState,
};
