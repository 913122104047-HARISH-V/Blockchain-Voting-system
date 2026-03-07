const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const WalletBinding = require("../models/WalletBinding");

async function getVoterDashboard(req, res, next) {
  try {
    const voterId = req.user.voterId;
    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    if (!voter.hasCompletedKYC) {
      return res.status(403).json({ message: "Complete KYC before accessing dashboard" });
    }

    const election = await Election.findOne({
      state_id: req.user.stateId,
      status: "active",
    }).sort({ start_time: -1 });

    if (!election) {
      return res.json({ voter, election: null, candidates: [], wallet_binding: null });
    }

    const candidates = await Candidate.find({
      election_id: election._id,
      constituency_id: req.user.constituencyId,
      is_active: true,
    })
      .populate("party_id", "name symbol")
      .sort({ created_at: 1 });

    const walletBinding = await WalletBinding.findOne({
      voter_id: voter._id,
      is_primary: true,
    });

    return res.json({
      voter,
      election,
      candidates,
      wallet_binding: walletBinding,
    });
  } catch (err) {
    return next(err);
  }
}

async function bindWallet(req, res, next) {
  try {
    const voterId = req.user.voterId;
    const { wallet_address } = req.body;
    if (!wallet_address) return res.status(400).json({ message: "wallet_address is required" });

    const normalized = wallet_address.toLowerCase();
    const existing = await WalletBinding.findOne({ voter_id: voterId, is_primary: true });
    if (existing) {
      existing.wallet_address = normalized;
      existing.bound_at = new Date();
      await existing.save();
      return res.json(existing);
    }

    const binding = await WalletBinding.create({
      voter_id: voterId,
      wallet_address: normalized,
      is_primary: true,
      bound_at: new Date(),
    });
    return res.status(201).json(binding);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getVoterDashboard,
  bindWallet,
};
