module.exports = {
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545",
  contractAddress: process.env.VOTING_CONTRACT_ADDRESS || "",
  chainId: Number(process.env.BLOCKCHAIN_CHAIN_ID || 1337),
  adminPrivateKey: process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY || "",
};
