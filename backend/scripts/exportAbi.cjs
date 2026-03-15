const fs = require("fs");
const path = require("path");

const backendRoot = path.resolve(__dirname, "..");
const frontendRoot = path.resolve(backendRoot, "..", "frontend");
const artifactPath = path.join(
  backendRoot,
  "artifacts",
  "smart-contracts",
  "Voting.sol",
  "StateElectionVoting.json"
);

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function main() {
  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      `Contract artifact not found at ${artifactPath}. Run "npm run compile:contracts" first.`
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  const backendAbiDir = path.join(backendRoot, "smart-contracts", "artifacts");
  const frontendAbiDir = path.join(frontendRoot, "src", "blockchain", "artifacts");

  ensureDir(backendAbiDir);
  ensureDir(frontendAbiDir);

  fs.writeFileSync(
    path.join(backendAbiDir, "StateElectionVoting.abi.json"),
    JSON.stringify(abi, null, 2)
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "StateElectionVoting.abi.json"),
    JSON.stringify(abi, null, 2)
  );

  console.log("ABI exported to backend and frontend artifact folders.");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
