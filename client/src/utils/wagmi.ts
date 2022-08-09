import { chain, configureChains, createClient } from "wagmi";

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

// import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

// RPC keys
// const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

export const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.optimismKovan, chain.optimism],
  [infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Grant Hub",
  chains,
});

const client = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});

export default client;
