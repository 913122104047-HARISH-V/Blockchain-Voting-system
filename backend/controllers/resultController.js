const Election = require("../models/Election");
const { tallyElectionVotes } = require("../services/tallyService");

async function getElectionResult(req, res, next) {
  try {
    const { electionId } = req.params;
    const result = await tallyElectionVotes(electionId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function getLatestStateResult(req, res, next) {
  try {
    const { stateId } = req.params;
    const election = await Election.findOne({
      state_id: stateId,
      status: "completed",
    }).sort({ end_time: -1 });

    if (!election) return res.status(404).json({ message: "No completed election found for state" });

    const result = await tallyElectionVotes(election._id.toString());
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getElectionResult,
  getLatestStateResult,
};
