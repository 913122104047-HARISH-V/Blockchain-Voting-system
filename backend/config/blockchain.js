const config = {
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545",
  contractAddress: process.env.VOTING_CONTRACT_ADDRESS || "",
  chainId: Number(process.env.BLOCKCHAIN_CHAIN_ID || 5777),
  adminPrivateKey: process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY || "",
};

export default config;
