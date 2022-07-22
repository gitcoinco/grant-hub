import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import fetch from "cross-fetch";

export const polygonClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/thelostone-mc/program-factory-v0",
      fetch,
    }),
  });

export default {};
