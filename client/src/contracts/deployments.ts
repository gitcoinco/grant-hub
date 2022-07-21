export const chains: { [key: number]: string } = {
  5: "goerli",
  69: "optimisticKovan",
};

export const addresses: { [key: string]: any } = {
  goerli: {
    projectRegistry: "0x1D4C316Ceb8cd3f497122606c9CCe2451F202B0a",
  },
  optimisticKovan: {
    projectRegistry: "0x95936606EDDB0ccDdD46d05AAB38F210FEEb5A8a",
  },
};

export const rpcEndpointInfo: { [key: number]: any } = {
  5: {
    chainId: "0x5",
    chainName: "Goerli Testnet",
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    nativeCurrency: {
      symbol: "GoerliETH",
      decimals: 18,
    },
  },
  69: {
    chainId: "0x45",
    chainName: "Optimistic Kovan",
    rpcUrls: ["https://kovan.optimism.io"],
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io/"],
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
    },
  },
};

export const addressesByChainID = (chainID: number) => {
  const chainName: string = chains[chainID];
  return addresses[chainName];
};
