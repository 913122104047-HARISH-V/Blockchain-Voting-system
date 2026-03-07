const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
const State = require("../models/State");
const { getVotesByElection } = require("./blockchainService");

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

  const votes = getVotesByElection(election._id.toString());
  const voteCountByCandidate = new Map();
  for (const vote of votes) {
    const prev = voteCountByCandidate.get(vote.candidateId) || 0;
    voteCountByCandidate.set(vote.candidateId, prev + 1);
  }

  const byConstituency = new Map();
  for (const candidate of candidates) {
    const constituencyId = candidate.constituency_id.toString();
    const candidateId = candidate._id.toString();
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

  return {
    election_id: election._id.toString(),
    state_id: election.state_id.toString(),
    majority_mark: majorityMark,
    constituency_winners: constituencyWinners,
    party_wins: partyWins,
    ruling_party: hasMajority ? rulingParty : null,
    total_votes_recorded: votes.length,
  };
}

module.exports = {
  tallyElectionVotes,
};
