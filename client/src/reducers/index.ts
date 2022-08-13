import {
  createRouterReducer,
  ReduxRouterState,
} from "@lagunovsky/redux-react-router";
import { combineReducers } from "redux";
import history from "../history";
import { newGrantReducer, NewGrantState } from "./newGrant";
import { roundsReducer, RoundsState } from "./rounds";
import { web3Reducer, Web3State } from "./web3";
/*
import { ProjectsState, projectsReducer } from "./projects";
import { GrantsMetadataState, grantsMetadataReducer } from "./grantsMetadata";

import {
  RoundApplicationState,
  roundApplicationReducer,
} from "./roundApplication";
*/
import { projectFormReducer, ProjectFormState } from "./projectForm";

export interface RootState {
  router: ReduxRouterState;
  web3: Web3State;
  newGrant: NewGrantState;
  rounds: RoundsState;
  //  roundApplication: RoundApplicationState;
  projectForm: ProjectFormState;
}

export const createRootReducer = () =>
  combineReducers({
    router: createRouterReducer(history),
    web3: web3Reducer,
    newGrant: newGrantReducer,
    rounds: roundsReducer,
    //    roundApplication: roundApplicationReducer,
    projectForm: projectFormReducer,
  });
