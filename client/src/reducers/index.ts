import {
  createRouterReducer,
  ReduxRouterState,
} from "@lagunovsky/redux-react-router";
import { combineReducers } from "redux";
import history from "../history";
import { newGrantReducer, NewGrantState } from "./newGrant";
import { roundsReducer, RoundsState } from "./rounds";
import { web3Reducer, Web3State } from "./web3";

export interface RootState {
  router: ReduxRouterState;
  web3: Web3State;
  newGrant: NewGrantState;
  rounds: RoundsState;
}

export const createRootReducer = () =>
  combineReducers({
    router: createRouterReducer(history),
    web3: web3Reducer,
    newGrant: newGrantReducer,
    rounds: roundsReducer,
  });
