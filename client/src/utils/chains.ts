import { Chain } from "@rainbow-me/rainbowkit";

const ftmTestnetIcon = "../assets/ftm-testnet.png";
const ftmMainnetIcon = "../assets/fantom-ftm-logo.png";
const optimismIcon = "../assets/optimism.png";
const ethIcon = "../assets/eth-diamond-glyph.png";

// RPC keys
const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

export const mainnet: Chain = {
  id: 1,
  name: "Mainnet",
  network: "ethereum mainnet",
  iconUrl: ethIcon,
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: `https://mainnet.infura.io/v3/${infuraId}`,
    alchemy: `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`,
    infura: `https://mainnet.infura.io/v3/${infuraId}`,
  },
  blockExplorers: {
    default: {
      name: "etherscan",
      url: "https://etherscan.io",
    },
  },
  testnet: false,
};

export const optimism: Chain = {
  id: 10,
  name: "Optimism",
  network: "optimism mainnet",
  iconUrl: optimismIcon,
  nativeCurrency: {
    decimals: 18,
    name: "Optimism Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://mainnet.optimism.io",
  },
  blockExplorers: {
    default: {
      name: "optimism explorer",
      url: "https://optimistic.etherscan.io",
    },
  },
  testnet: false,
};

export const optimismGoerli: Chain = {
  id: 420,
  name: "Optimism Goerli",
  network: "optimism goerli",
  iconUrl: optimismIcon,
  nativeCurrency: {
    decimals: 18,
    name: "Optimism Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://goerli.optimism.io",
  },
  blockExplorers: {
    default: {
      name: "optimism explorer",
      url: "https://optimistic.etherscan.io",
    },
  },
  testnet: true,
};

export const fantomTestnet: Chain = {
  id: 4002,
  name: "Fantom Testnet",
  network: "fantom testnet",
  iconUrl: ftmTestnetIcon,
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc.testnet.fantom.network/",
  },
  blockExplorers: {
    default: { name: "ftmscan", url: "https://testnet.ftmscan.com" },
  },
  testnet: true,
};

export const fantomMainnet: Chain = {
  id: 250,
  name: "Fantom",
  network: "fantom mainnet",
  iconUrl: ftmMainnetIcon,
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc.ftm.tools/",
  },
  blockExplorers: {
    default: { name: "ftmscan", url: "https://ftmscan.com" },
  },
  testnet: false,
};
