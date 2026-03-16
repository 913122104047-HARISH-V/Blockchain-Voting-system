import { getVotingContract } from './voteContract'

function parseEthersError(err) {
  if (!err) return 'Transaction failed'
  // ethers v6 error shape
  if (err.info?.error?.data?.message) return err.info.error.data.message
  if (err.info?.error?.message) return err.info.error.message
  if (err.shortMessage) return err.shortMessage
  if (err.message) return err.message
  return 'Transaction failed'
}

export async function submitVoteTransaction({ electionOnChainId, candidateOnChainId }) {
  if (!electionOnChainId || !candidateOnChainId) {
    throw new Error('Voting is not available: missing on-chain election or candidate id.')
  }

  const contract = await getVotingContract()
  if (!contract || typeof contract.vote !== 'function') {
    throw new Error('Voting contract is not connected correctly. Check contract address and ABI.')
  }

  // Pre-flight: ensure this wallet is registered and hasn't voted
  try {
    const signerAddress =
      (await contract.runner?.getAddress?.()) ||
      (await contract.signer?.getAddress?.()) ||
      null

    if (signerAddress && typeof contract.getRegisteredVoterDetails === 'function') {
      const [isRegistered, constituencyId, hasVoted] = await contract.getRegisteredVoterDetails(
        electionOnChainId,
        signerAddress
      )
      if (!isRegistered) {
        throw new Error('Your wallet is not registered for this election. Bind your wallet first or wait for sync.')
      }
      if (hasVoted) {
        throw new Error('You have already voted in this election.')
      }
    }
  } catch (err) {
    // Surface readable message, otherwise continue to tx for exact revert
    const msg = parseEthersError(err)
    if (msg) throw new Error(msg)
  }

  // Try to estimate gas; if not supported, fall through to actual tx.
  if (contract.estimateGas && typeof contract.estimateGas.vote === 'function') {
    try {
      await contract.estimateGas.vote(electionOnChainId, candidateOnChainId)
    } catch (err) {
      throw new Error(parseEthersError(err))
    }
  }

  try {
    const tx = await contract.vote(electionOnChainId, candidateOnChainId)
    const receipt = await tx.wait()
    return { transactionHash: receipt.hash }
  } catch (err) {
    throw new Error(parseEthersError(err))
  }
}
