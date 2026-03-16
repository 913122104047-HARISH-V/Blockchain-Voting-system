import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import State from "../models/State.js";
import { getResultsByElection } from "./blockchainService.js";

async function tallyElectionVotes(electionId) {
  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error("Election not found");
  }

  const state = await State.findById(election.state_id);
  const candidates = await Candidate.find({
    election_id: election._id,
    is_active: true,
  }).populate("party_id", "name");

  if (!election.on_chain_id) {
    throw new Error("Election is not synced on blockchain");
  }

  const votes = await getResultsByElection(election.on_chain_id);
  const voteCountByCandidate = new Map();
  for (const vote of votes) {
    voteCountByCandidate.set(String(vote.id), vote.voteCount);
  }

  const byConstituency = new Map();
  for (const candidate of candidates) {
    const constituencyId = candidate.constituency_id.toString();
    const candidateId = String(candidate.on_chain_id || "");
    const count = voteCountByCandidate.get(candidateId) || 0;
    const current = byConstituency.get(constituencyId);
    if (!current || count > current.votes) {
      byConstituency.set(constituencyId, {
        constituency_id: constituencyId,
        candidate_id: candidateId,
        candidate_name: candidate.name,
        party_id: candidate.party_id ? candidate.party_id._id.toString() : null,
        party_name: candidate.party_id ? candidate.party_id.name : "Independent",
        votes: count,
      });
    }
  }

  const constituencyWinners = Array.from(byConstituency.values());
  const partyWins = {};
  for (const winner of constituencyWinners) {
    partyWins[winner.party_name] = (partyWins[winner.party_name] || 0) + 1;
  }

  let rulingParty = null;
  let maxSeats = 0;
  for (const [partyName, seats] of Object.entries(partyWins)) {
    if (seats > maxSeats) {
      maxSeats = seats;
      rulingParty = partyName;
    }
  }

  const majorityMark = state ? state.majority_mark : 0;
  const hasMajority = maxSeats >= majorityMark;
  const totalVotesRecorded = votes.reduce(
    (sum, candidateVote) => sum + candidateVote.voteCount,
    0
  );

  return {
    election_id: election._id.toString(),
    state_id: election.state_id.toString(),
    majority_mark: majorityMark,
    constituency_winners: constituencyWinners,
    party_wins: partyWins,
    ruling_party: hasMajority ? rulingParty : null,
    total_votes_recorded: totalVotesRecorded,
  };
}

export { tallyElectionVotes };
