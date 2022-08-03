import { chain, configureChains, createClient } from "wagmi";

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

// RPC keys
// const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.optimismKovan, chain.optimism],
  [infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimChainChangedDisconnect: false,
      },
    }),
    new CoinbaseWalletConnector({
      chains: [
        chain.mainnet,
        chain.optimism,
        chain.optimismKovan,
        chain.goerli,
      ],
      options: {
        appName: "Gitcoin Grant Hub",
      },
    }),
    new WalletConnectConnector({
      chains: [
        chain.mainnet,
        chain.optimism,
        chain.optimismKovan,
        chain.goerli,
      ],
      options: {
        qrcode: true,
        rpc: {
          1: "https://eth-mainnet.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",
          10: "https://mainnet.optimism.io",
          69: "https://kovan.optimism.io",
          420: "https://goerli.optimism.io",
        },
      },
    }),
    new InjectedConnector({
      chains: [
        chain.mainnet,
        chain.optimism,
        chain.optimismKovan,
        chain.goerli,
      ],
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export default client;
