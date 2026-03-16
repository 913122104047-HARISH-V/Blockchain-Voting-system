import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Voter from "../models/Voter.js";
import WalletBinding from "../models/WalletBinding.js";
import Constituency from "../models/Constituency.js";
import State from "../models/State.js";
import { registerVoterOnChain } from "../services/blockchainService.js";

async function getVoterDashboard(req, res, next) {
  try {
    const voterId =
      req.user?.voterId ||
      req.user?._id ||
      req.body?.voter_id ||
      req.query?.voter_id;

    if (!voterId) {
      return res.status(400).json({ message: "voter_id is required" });
    }

    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    if (!voter.hasCompletedKYC) {
      return res.status(403).json({ message: "Complete KYC before accessing dashboard" });
    }

    const constituency = await Constituency.findById(voter.constituency_id);
    const state = await State.findById(req.user?.stateId || constituency?.state_id);
    const voterResponse = {
      ...voter.toObject(),
      constituency: constituency ? constituency.name : null,
      state: state ? state.name : req.user.stateId,
    };

    const electionFilter = { status: "active" };
    const stateIdForQuery = req.user?.stateId || constituency?.state_id;
    if (stateIdForQuery) {
      electionFilter.state_id = stateIdForQuery;
    }

    const election = await Election.findOne(electionFilter).sort({ start_time: -1 });

    if (!election) {
      return res.json({ voter: voterResponse, election: null, candidates: [], wallet_binding: null });
    }

    const constituencyIdForQuery = req.user?.constituencyId || voter.constituency_id;

    const candidates = await Candidate.find({
      election_id: election._id,
      constituency_id: constituencyIdForQuery,
      is_active: true,
    })
      .populate("party_id", "name symbol")
      .sort({ created_at: 1 });

    const walletBinding = await WalletBinding.findOne({
      voter_id: voter._id,
      is_primary: true,
    });

    return res.json({
      voter: voterResponse,
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
    const voterId =
      req.user?.voterId ||
      req.body?.voter_id ||
      req.query?.voter_id;
    const { wallet_address } = req.body;
    if (!voterId) {
      return res.status(400).json({ message: "voter_id or auth token is required" });
    }
    if (!wallet_address) return res.status(400).json({ message: "wallet_address is required" });

    const normalized = wallet_address.toLowerCase();
    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    const constituency = await Constituency.findById(voter.constituency_id);
    if (!constituency) {
      return res.status(404).json({ message: "Constituency not found for voter" });
    }
    const stateId = req.user?.stateId || constituency.state_id;

    const existing = await WalletBinding.findOne({ voter_id: voterId, is_primary: true });
    let walletBinding;
    if (existing) {
      existing.wallet_address = normalized;
      existing.bound_at = new Date();
      walletBinding = await existing.save();
    } else {
      walletBinding = await WalletBinding.create({
        voter_id: voterId,
        wallet_address: normalized,
        is_primary: true,
        bound_at: new Date(),
      });
    }

    const activeElections = await Election.find({
      state_id: stateId,
      status: { $in: ["scheduled", "active"] },
      on_chain_id: { $ne: null },
    });

    if (constituency.on_chain_id) {
      for (const election of activeElections) {
        await registerVoterOnChain({
          electionOnChainId: election.on_chain_id,
          voterWalletAddress: normalized,
          constituencyOnChainId: constituency.on_chain_id,
        });
      }
    }

    return res.status(existing ? 200 : 201).json(walletBinding);
  } catch (err) {
    return next(err);
  }
}

export {
  getVoterDashboard,
  bindWallet,
};
