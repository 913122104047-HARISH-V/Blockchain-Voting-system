export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.")
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" })

  if (chainId !== "0x539") { // 1337 in hex
    throw new Error("Please switch MetaMask to Ganache Local Network.")
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })

  if (!accounts?.length) {
    throw new Error("No wallet account was returned.")
  }

  return accounts[0]
}


/*export async function connectWallet() {
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
}*/
