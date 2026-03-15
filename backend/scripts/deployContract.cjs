const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const backendRoot = path.resolve(__dirname, "..");
const frontendRoot = path.resolve(backendRoot, "..", "frontend");
const artifactPath = path.join(
  backendRoot,
  "artifacts",
  "smart-contracts",
  "Voting.sol",
  "StateElectionVoting.json"
);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function upsertEnvValue(filePath, key, value) {
  let content = "";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(content)) {
    content = content.replace(pattern, line);
  } else {
    content = `${content.trimEnd()}\n${line}\n`;
  }

  fs.writeFileSync(filePath, content, "utf8");
}

async function main() {
  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      `Contract artifact not found at ${artifactPath}. Run "npm run compile:contracts" first.`
    );
  }

  const rpcUrl = requireEnv("BLOCKCHAIN_RPC_URL");
const privateKey = requireEnv("BLOCKCHAIN_ADMIN_PRIVATE_KEY");

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const provider = new ethers.JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();
const chainId = Number(network.chainId);

console.log("Connected Chain ID:", chainId);


  const wallet = new ethers.Wallet(privateKey, provider);
  const bytecode = artifact.bytecode?.object || artifact.bytecode;
  if (!bytecode || !String(bytecode).startsWith("0x")) {
    throw new Error("Bytecode missing or invalid in artifact");
  }

  const factory = new ethers.ContractFactory(artifact.abi, bytecode, wallet);
  console.log("ABI loaded:", artifact.abi.length);
  console.log("Bytecode length:", String(bytecode).length);

  console.log("Deploying StateElectionVoting...");
  const deployOptions = {};
  deployOptions.gasLimit = BigInt(process.env.DEPLOY_GAS_LIMIT || 6_000_000);
  if (process.env.DEPLOY_GAS_PRICE_GWEI) {
    deployOptions.gasPrice = ethers.parseUnits(process.env.DEPLOY_GAS_PRICE_GWEI, "gwei");
  }

  const contract = await factory.deploy(deployOptions);
  await contract.waitForDeployment();


  const contractAddress = await contract.getAddress();
  console.log(`Contract deployed at: ${contractAddress}`);

  
  upsertEnvValue(path.join(backendRoot, ".env"), "VOTING_CONTRACT_ADDRESS", contractAddress);
  upsertEnvValue(
    path.join(frontendRoot, ".env"),
    "VITE_VOTING_CONTRACT_ADDRESS",
    contractAddress
  );
  upsertEnvValue(
    path.join(frontendRoot, ".env"),
    "VITE_BLOCKCHAIN_CHAIN_ID",
    chainId
  );

  console.log("Updated backend/.env and frontend/.env with deployed contract address.");
}

main().catch((error) => {
  console.error("Deploy failed:", error);
  console.error("RPC error body:", error?.error?.body || "");
  process.exit(1);
});
