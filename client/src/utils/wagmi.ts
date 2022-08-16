import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

// RPC keys
const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

const chainsAvailable: Chain[] = [];
if (process.env.NODE_ENV === "production") {
  chainsAvailable.push(chain.optimism);
} else {
  chainsAvailable.push(chain.goerli, chain.optimismKovan);
}

export const { chains, provider } = configureChains(chainsAvailable, [
  infuraProvider({ apiKey: infuraId, priority: 0 }),
  alchemyProvider({ apiKey: alchemyId, priority: 1 }),
  publicProvider({ priority: 2 }),
]);

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
