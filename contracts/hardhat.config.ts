import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@primitivefi/hardhat-dodoc";
import "hardhat-gas-reporter"

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },

  networks: {
    hardhat: {
      forking: {
        url: process.env.GOERLI_URL || "",
      },
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    optimism: {
      url: process.env.OPTIMISM_URL || "",
    },
    optimisticKovan: {
      url: process.env.OPTIMISTIC_KOVAN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    fantomTestnet: {
      url: process.env.FANTOM_TESTNEST_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    fantom: {
      url: process.env.FANTOM_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    }
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },

  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY!,
      mainnet: process.env.ETHERSCAN_API_KEY!,
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY!,
      opera: process.env.FANTOM_SCAN_KEY!,
    },
  },
};

export default config;
