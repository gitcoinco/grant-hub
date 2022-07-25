import {
  PROGRAM_LOADING,
  PROGRAM_LOADED,
  PROGRAM_UNLOADED,
  PROGRAM_LOADING_ERROR,
  ProgramActions,
} from "../actions/program";

import { ProgramMetadata } from "../types";

export const enum Status {
  Empty = 0,
  Loading,
  Loaded,
  Error,
}

export interface ProgramState {
  [address: string]: {
    error: boolean;
    program: ProgramMetadata | undefined;
    status: Status;
  };
}

const initialState: ProgramState = {};

const programInitialState = {
  error: undefined,
  program: undefined,
  status: Status.Empty,
};

export const programReducer = (
  state: ProgramState = initialState,
  action: ProgramActions
): ProgramState => {
  switch (action.type) {
    case PROGRAM_LOADING: {
      const program = state[action.address] || programInitialState;
      return {
        ...state,
        [action.address]: {
          ...program,
          status: Status.Loading,
        },
      };
    }
    case PROGRAM_LOADED: {
      const program = state[action.address] || programInitialState;
      return {
        ...state,
        [action.address]: {
          ...program,
          status: Status.Loaded,
          program: action.program,
        },
      };
    }
    case PROGRAM_LOADING_ERROR: {
      const program = state[action.address] || programInitialState;
      return {
        ...state,
        [action.address]: {
          ...program,
          status: Status.Error,
        },
      };
    }
    case PROGRAM_UNLOADED: {
      return initialState;
    }
    default:
      return state;
  }
};
