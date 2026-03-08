const { ethers } = require("ethers");
const blockchainConfig = require("../config/blockchain");

const votingAbi = [
  "function createElection(string title,string stateName,uint256 startTime,uint256 endTime) external",
  "function createConstituency(string name,string stateName) external",
  "function addCandidate(uint256 electionId,string name,string party,uint256 constituencyId) external",
  "function registerVoter(uint256 electionId,address voter,uint256 constituencyId) external",
  "function startElection(uint256 electionId) external",
  "function endElection(uint256 electionId) external",
  "function publishResults(uint256 electionId) external",
  "function electionCounter() external view returns (uint256)",
  "function constituencyCounter() external view returns (uint256)",
  "function candidateCounter() external view returns (uint256)",
  "function getResults(uint256 electionId) external view returns ((uint256 id,string name,string party,uint256 constituencyId,uint256 voteCount,bool isActive)[])",
];

let provider;
let wallet;
let contract;
let contractInterface;

function assertBlockchainConfig() {
  if (!blockchainConfig.rpcUrl) {
    throw new Error("BLOCKCHAIN_RPC_URL is not configured");
  }

  if (!blockchainConfig.contractAddress) {
    throw new Error("VOTING_CONTRACT_ADDRESS is not configured");
  }

  if (!blockchainConfig.adminPrivateKey) {
    throw new Error("BLOCKCHAIN_ADMIN_PRIVATE_KEY is not configured");
  }
}

function getVotingContract() {
  if (contract) {
    return contract;
  }

  assertBlockchainConfig();

  provider = new ethers.JsonRpcProvider(blockchainConfig.rpcUrl, blockchainConfig.chainId);
  wallet = new ethers.Wallet(blockchainConfig.adminPrivateKey, provider);
  contract = new ethers.Contract(blockchainConfig.contractAddress, votingAbi, wallet);
  contractInterface = new ethers.Interface(votingAbi);

  return contract;
}

function getProvider() {
  if (provider) {
    return provider;
  }

  getVotingContract();
  return provider;
}

function toUnixTimestamp(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Math.floor(date.getTime() / 1000);
}

async function createConstituencyOnChain({ name, stateName }) {
  const votingContract = getVotingContract();
  const tx = await votingContract.createConstituency(name, stateName);
  await tx.wait();
  const onChainId = Number(await votingContract.constituencyCounter());

  return {
    txHash: tx.hash,
    onChainId,
  };
}

async function createElectionOnChain({ title, stateName, startTime, endTime }) {
  const votingContract = getVotingContract();
  const tx = await votingContract.createElection(
    title,
    stateName,
    toUnixTimestamp(startTime),
    toUnixTimestamp(endTime)
  );
  await tx.wait();
  const onChainId = Number(await votingContract.electionCounter());

  return {
    txHash: tx.hash,
    onChainId,
  };
}

async function addCandidateOnChain({
  electionOnChainId,
  candidateName,
  partyName,
  constituencyOnChainId,
}) {
  const votingContract = getVotingContract();
  const tx = await votingContract.addCandidate(
    electionOnChainId,
    candidateName,
    partyName,
    constituencyOnChainId
  );
  await tx.wait();
  const onChainId = Number(await votingContract.candidateCounter());

  return {
    txHash: tx.hash,
    onChainId,
  };
}

async function registerVoterOnChain({
  electionOnChainId,
  voterWalletAddress,
  constituencyOnChainId,
}) {
  const votingContract = getVotingContract();
  const tx = await votingContract.registerVoter(
    electionOnChainId,
    voterWalletAddress,
    constituencyOnChainId
  );
  await tx.wait();

  return {
    txHash: tx.hash,
  };
}

async function startElectionOnChain(electionOnChainId) {
  const votingContract = getVotingContract();
  const tx = await votingContract.startElection(electionOnChainId);
  await tx.wait();

  return {
    txHash: tx.hash,
  };
}

async function endElectionOnChain(electionOnChainId) {
  const votingContract = getVotingContract();
  const tx = await votingContract.endElection(electionOnChainId);
  await tx.wait();

  return {
    txHash: tx.hash,
  };
}

async function publishResultsOnChain(electionOnChainId) {
  const votingContract = getVotingContract();
  const tx = await votingContract.publishResults(electionOnChainId);
  await tx.wait();

  return {
    txHash: tx.hash,
  };
}

async function getResultsByElection(electionOnChainId) {
  const votingContract = getVotingContract();
  const candidates = await votingContract.getResults(electionOnChainId);

  return candidates.map((candidate) => ({
    id: Number(candidate.id),
    name: candidate.name,
    party: candidate.party,
    constituencyId: Number(candidate.constituencyId),
    voteCount: Number(candidate.voteCount),
    isActive: candidate.isActive,
  }));
}

async function verifyVoteTransaction({
  txHash,
  electionOnChainId,
  candidateOnChainId,
  walletAddress,
}) {
  if (!txHash) {
    throw new Error("tx_hash is required");
  }

  const rpcProvider = getProvider();
  const tx = await rpcProvider.getTransaction(txHash);
  if (!tx) {
    throw new Error("Transaction not found");
  }

  const receipt = await rpcProvider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1n) {
    throw new Error("Transaction not confirmed successfully");
  }

  if (!tx.to || tx.to.toLowerCase() !== blockchainConfig.contractAddress.toLowerCase()) {
    throw new Error("Transaction was not sent to the voting contract");
  }

  if (tx.from.toLowerCase() !== String(walletAddress).toLowerCase()) {
    throw new Error("Transaction sender does not match the bound wallet");
  }

  const parsed = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  if (!parsed || parsed.name !== "vote") {
    throw new Error("Transaction is not a vote call");
  }

  const [electionIdArg, candidateIdArg] = parsed.args;
  if (Number(electionIdArg) !== Number(electionOnChainId)) {
    throw new Error("Transaction election id does not match");
  }

  if (Number(candidateIdArg) !== Number(candidateOnChainId)) {
    throw new Error("Transaction candidate id does not match");
  }

  return {
    blockNumber: Number(receipt.blockNumber),
    txHash,
  };
}

module.exports = {
  createConstituencyOnChain,
  createElectionOnChain,
  addCandidateOnChain,
  registerVoterOnChain,
  startElectionOnChain,
  endElectionOnChain,
  publishResultsOnChain,
  getResultsByElection,
  verifyVoteTransaction,
};
