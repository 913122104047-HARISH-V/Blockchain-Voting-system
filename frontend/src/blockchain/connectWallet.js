export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed.')
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })

  if (!accounts?.length) {
    throw new Error('No wallet account was returned.')
  }

  return accounts[0]
}
