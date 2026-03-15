export const blockchainConfig = {
  contractAddress: import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || '',
  chainId: Number(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || 1337),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
}
