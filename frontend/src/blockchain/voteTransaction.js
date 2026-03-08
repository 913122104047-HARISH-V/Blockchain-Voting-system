import { getVotingContract } from './voteContract'

export async function submitVoteTransaction({ electionOnChainId, candidateOnChainId }) {
  const contract = await getVotingContract()
  const tx = await contract.vote(electionOnChainId, candidateOnChainId)
  const receipt = await tx.wait()

  return {
    transactionHash: receipt.hash,
  }
}
