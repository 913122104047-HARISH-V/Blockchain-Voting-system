const crypto = require("crypto");

const voteLedger = new Map();
const votedWalletsByElection = new Map();

function normalizeWallet(walletAddress) {
  return String(walletAddress || "").toLowerCase();
}

function castVote({ electionId, candidateId, walletAddress }) {
  const normalizedWallet = normalizeWallet(walletAddress);
  if (!normalizedWallet) {
    throw new Error("Wallet address is required");
  }

  const electionKey = String(electionId);
  const wallets = votedWalletsByElection.get(electionKey) || new Set();
  if (wallets.has(normalizedWallet)) {
    throw new Error("This wallet has already voted in this election");
  }

  const txHash = `0x${crypto.randomBytes(32).toString("hex")}`;
  wallets.add(normalizedWallet);
  votedWalletsByElection.set(electionKey, wallets);

  const electionVotes = voteLedger.get(electionKey) || [];
  electionVotes.push({
    candidateId: Number(candidateId),
    walletAddress: normalizedWallet,
    txHash,
    timestamp: new Date().toISOString(),
  });
  voteLedger.set(electionKey, electionVotes);

  return { txHash };
}

function getVotesByElection(electionId) {
  return voteLedger.get(String(electionId)) || [];
}

module.exports = {
  castVote,
  getVotesByElection,
};
