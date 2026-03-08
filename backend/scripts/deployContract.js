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
  const chainId = process.env.BLOCKCHAIN_CHAIN_ID || "1337";

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const provider = new ethers.JsonRpcProvider(rpcUrl, Number(chainId));
  const wallet = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Deploying StateElectionVoting...");
  const contract = await factory.deploy();
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
  console.error(error);
  process.exit(1);
});
