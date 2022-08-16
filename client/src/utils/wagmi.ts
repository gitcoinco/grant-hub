import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

// RPC keys
const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

export const { chains, provider } = configureChains(
  [chain.goerli, chain.optimismKovan, chain.optimism],
  [
    infuraProvider({ apiKey: infuraId, priority: 0 }),
    alchemyProvider({ apiKey: alchemyId, priority: 1 }),
    publicProvider({ priority: 2 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Grant Hub",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default client;
