import { ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../reducers";

export const healthClient = new ApolloClient({
  uri: "https://api.thegraph.com/index-node/graphql",
  cache: new InMemoryCache(),
});

export const goerliClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/danielesalatti/project-registry-goerli",
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export const roundManagerGoerliClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/thelostone-mc/program-factory-v0",
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export const optimismKovanClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/danielesalatti/project-registry-optimism-kovan",
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  },
});

export const roundManagerOptimismKovanClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/thelostone-mc/grants-round-optimism-kovan",
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  },
});

export const roundManagerOptimismClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/thelostone-mc/grants-round-optimism-mainnet",
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  },
});

export const SUBGRAPH_HEALTH = gql`
  query health($name: Bytes) {
    indexingStatusForCurrentVersion(subgraphName: $name, subgraphError: allow) {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`;

export const FETCH_PROJECTS_BY_ACCOUNT_ADDRESS = gql`
  query projectsByAccountAddress($address: Bytes!) {
    projects(where: { accounts_: { account: $address } }) {
      id
      accounts {
        id
        account {
          id
          address
        }
      }
      metaPtr {
        id
        pointer
        protocol
      }
    }
  }
`;

export const FETCH_ROUND_BY_ADDRESS = gql`
  query roundByAddress($address: Bytes!) {
    round(id: $address) {
      id
      applicationsStartTime
      applicationsEndTime
      applicationMetaPtr {
        id
        pointer
        protocol
      }
      roundMetaPtr {
        id
        pointer
        protocol
      }
    }
  }
`;

interface HealthResponse {
  indexingStatusForCurrentVersion: {
    chains: {
      chainHeadBlock: {
        number: string;
      };
      latestBlock: {
        number: string;
      };
    }[];
    synced: boolean;
    health: string;
    fatalError: {
      message: string;
      block: {
        number: string;
        hash: string;
      };
      handler: string;
    };
  };
}

export function useFetchedSubgraphStatus(): {
  available: boolean | null;
  syncedBlock: number | undefined;
  headBlock: number | undefined;
  healthy: boolean | null;
} {
  const props = useSelector(
    (state: RootState) => ({
      chainID: state.web3.chainID,
    }),
    shallowEqual
  );

  const { loading, error, data } = useQuery<HealthResponse>(SUBGRAPH_HEALTH, {
    client: healthClient,
    fetchPolicy: "network-only",
    variables: {
      name:
        props.chainID === 69
          ? "danielesalatti/project-registry-optimism-kovan"
          : "danielesalatti/project-registry-goerli",
    },
  });

  const parsed = data?.indexingStatusForCurrentVersion;

  if (loading) {
    return {
      available: null,
      syncedBlock: undefined,
      headBlock: undefined,
      healthy: null,
    };
  }

  if ((!loading && !parsed) || error) {
    return {
      available: false,
      syncedBlock: undefined,
      headBlock: undefined,
      healthy: null,
    };
  }

  const syncedBlock = parsed?.chains[0].latestBlock.number;
  const headBlock = parsed?.chains[0].chainHeadBlock.number;
  const healthy = parsed?.health === "healthy";

  return {
    available: true,
    syncedBlock: syncedBlock ? parseFloat(syncedBlock) : undefined,
    headBlock: headBlock ? parseFloat(headBlock) : undefined,
    healthy,
  };
}

export type ProjectsResponse = {
  projects: [
    {
      id: string;
      accounts?: {
        id: string;
        account: {
          address: string;
        };
      };
      metaPtr: {
        id: string;
        pointer: string;
        protocol: string;
      };
    }
  ];
};

export type RoundResponse = {
  round: {
    id: string;
    applicationsStartTime: string;
    applicationsEndTime: string;
    applicationMetaPtr: {
      id: string;
      pointer: string;
      protocol: number;
    };
    roundStartTime: string;
    roundEndTime: string;
    roundMetaPtr: {
      id: string;
      pointer: string;
      protocol: number;
    };
    token: string;
  };
};

export function useFetchedProjects(): ProjectsResponse | null {
  const props = useSelector(
    (state: RootState) => ({
      chainID: state.web3.chainID,
      account: state.web3.account,
    }),
    shallowEqual
  );

  console.log("DASA props", props);

  const { loading, error, data } = useQuery<ProjectsResponse>(
    FETCH_PROJECTS_BY_ACCOUNT_ADDRESS,
    {
      client: props.chainID === 69 ? optimismKovanClient : goerliClient,
      fetchPolicy: "network-only",
      variables: {
        address: props.account?.toLowerCase(),
      },
    }
  );

  const parsed = data?.projects;

  if (loading) {
    return null;
  }

  if ((!loading && !parsed) || error) {
    return null;
  }

  return {
    projects: parsed!,
  };
}

export function useFetchRoundByAddress(address: string): RoundResponse | null {
  const props = useSelector(
    (state: RootState) => ({
      chainID: state.web3.chainID,
    }),
    shallowEqual
  );

  const { loading, error, data } = useQuery<RoundResponse>(
    FETCH_ROUND_BY_ADDRESS,
    {
      client:
        props.chainID === 69
          ? roundManagerOptimismKovanClient
          : roundManagerGoerliClient,
      fetchPolicy: "network-only",
      variables: {
        address: address.toLowerCase(),
      },
    }
  );

  const parsed = data?.round;

  if (loading) {
    return null;
  }

  if ((!loading && !parsed) || error) {
    return null;
  }

  return {
    round: parsed!,
  };
}
