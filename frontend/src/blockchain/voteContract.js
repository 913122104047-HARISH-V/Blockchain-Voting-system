import { BrowserProvider, Contract } from 'ethers'
import { blockchainConfig } from '../config'
import votingAbi from './artifacts/StateElectionVoting.abi.json'

export async function getVotingContract() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed.')
  }

  const provider = new BrowserProvider(window.ethereum)
  const network = await provider.getNetwork()

  if (Number(network.chainId) !== blockchainConfig.chainId) {
    throw new Error(`Switch MetaMask to chain ${blockchainConfig.chainId}.`)
  }

  if (!blockchainConfig.contractAddress) {
    throw new Error('VITE_VOTING_CONTRACT_ADDRESS is not configured.')
  }

  const signer = await provider.getSigner()
  return new Contract(blockchainConfig.contractAddress, votingAbi, signer)
}
