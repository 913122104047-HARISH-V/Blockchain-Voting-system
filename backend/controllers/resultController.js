import Election from "../models/Election.js";
import { tallyElectionVotes } from "../services/tallyService.js";
import { publishResultsOnChain } from "../services/blockchainService.js";

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

async function publishElectionResult(req, res, next) {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: "Election not found" });
    if (!election.on_chain_id) {
      return res.status(400).json({ message: "Election is not synced on blockchain" });
    }

    const published = await publishResultsOnChain(election.on_chain_id);

    return res.json({
      message: "Results published on blockchain",
      election_id: election._id,
      tx_hash: published.txHash,
    });
  } catch (err) {
    return next(err);
  }
}

export {
  getElectionResult,
  getLatestStateResult,
  publishElectionResult,
};
