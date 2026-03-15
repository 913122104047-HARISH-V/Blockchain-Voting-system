import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.19",
    settings: {
      evmVersion: "paris", // avoids Shanghai-only PUSH0 on older nodes
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./smart-contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
  },
});
