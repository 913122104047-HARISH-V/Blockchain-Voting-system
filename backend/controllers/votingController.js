const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const WalletBinding = require("../models/WalletBinding");
const { verifyVoteTransaction } = require("../services/blockchainService");

async function submitVote(req, res, next) {
  try {
    const voterId = req.user.voterId;
    const { candidate_id, wallet_address, tx_hash } = req.body;
    if (!candidate_id || !wallet_address) {
      return res.status(400).json({ message: "candidate_id and wallet_address are required" });
    }

    const primaryWallet = await WalletBinding.findOne({
      voter_id: voterId,
      is_primary: true,
    });
    if (!primaryWallet) {
      return res.status(400).json({ message: "Bind wallet before voting" });
    }

    if (primaryWallet.wallet_address.toLowerCase() !== String(wallet_address).toLowerCase()) {
      return res.status(403).json({ message: "Wallet does not match primary bound wallet" });
    }

    const election = await Election.findOne({
      state_id: req.user.stateId,
      status: "active",
    });
    if (!election) return res.status(400).json({ message: "No active election for your state" });

    const candidate = await Candidate.findOne({
      _id: candidate_id,
      election_id: election._id,
      constituency_id: req.user.constituencyId,
      is_active: true,
    });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found in your constituency election list" });
    }

    if (!election.on_chain_id || !candidate.on_chain_id) {
      return res.status(400).json({ message: "Election or candidate is not synced on blockchain" });
    }

    let verification = null;
    if (tx_hash) {
      verification = await verifyVoteTransaction({
        txHash: tx_hash,
        electionOnChainId: election.on_chain_id,
        candidateOnChainId: candidate.on_chain_id,
        walletAddress: wallet_address,
      });
    }

    return res.json({
      message: tx_hash
        ? "Vote transaction verified"
        : "Vote validated. Submit using MetaMask from the frontend.",
      tx_hash: tx_hash || null,
      election_id: election._id,
      candidate_id: candidate._id,
      election_on_chain_id: election.on_chain_id,
      candidate_on_chain_id: candidate.on_chain_id,
      verification,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  submitVote,
};
