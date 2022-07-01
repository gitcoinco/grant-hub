export const chains: { [key: number]: string } = {
  5: "goerli",
  69: "optimisticKovan",
};

export const addresses: { [key: string]: any } = {
  goerli: {
    projectRegistry: "0xf47669845D97f66922058430f01F24AdA28Aaf36",
  },
  optimisticKovan: {
    projectRegistry: "0x46Da9bbe66d0FA187b46371D850245838D3c6850",
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
