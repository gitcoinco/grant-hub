import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useNetwork, chain } from "wagmi";
import {
  goerliClient,
  optimismKovanClient,
  roundManagerGoerliClient,
  roundManagerOptimismKovanClient,
} from "../services/graphqlClient";

export function useGranthubClient(): ApolloClient<NormalizedCacheObject> | null {
  const { chain: currentChain } = useNetwork();

  console.log("DASA currentChain", currentChain);

  switch (currentChain?.id) {
    case chain.optimismKovan.id:
      return optimismKovanClient;
    case chain.goerli.id:
      return goerliClient;
    default:
      return null;
  }
}

export function useRoundManagerClient(): ApolloClient<NormalizedCacheObject> | null {
  const { chain: currentChain } = useNetwork();

  console.log("DASA currentChain", currentChain);

  switch (currentChain?.id) {
    case chain.optimismKovan.id:
      return roundManagerOptimismKovanClient;
    case chain.goerli.id:
      return roundManagerGoerliClient;
    default:
      return null;
  }
}

// Get all required subgraph clients
export function useClients(): {
  grantHubClient: ApolloClient<NormalizedCacheObject> | null;
  roundManagerClient: ApolloClient<NormalizedCacheObject> | null;
} {
  const grantHubClient = useGranthubClient();
  const roundManagerClient = useRoundManagerClient();
  return {
    grantHubClient,
    roundManagerClient,
  };
}
