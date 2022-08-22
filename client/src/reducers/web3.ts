import {
  ENS_NAME_LOADED,
  Web3Actions,
  WEB3_ACCOUNT_DISCONNECTED,
  WEB3_ACCOUNT_LOADED,
  WEB3_CHAIN_ID_LOADED,
  WEB3_ERROR,
  WEB3_INITIALIZED,
} from "../actions/web3";

export interface Web3State {
  initialized: boolean;
  chainID: number | undefined;
  error: string | undefined;
  account: string | undefined;
  ens: string | undefined;
}

const initialState: Web3State = {
  initialized: false,
  chainID: undefined,
  error: undefined,
  account: undefined,
  ens: undefined,
};

export const web3Reducer = (
  state: Web3State = initialState,
  action: Web3Actions
): Web3State => {
  switch (action.type) {
    case WEB3_INITIALIZED: {
      return {
        ...state,
        error: undefined,
        // initializing: false,
        initialized: true,
      };
    }

    case WEB3_ERROR: {
      return {
        ...state,
        // initializing: false,
        initialized: false,
        error: action.error,
      };
    }

    case WEB3_CHAIN_ID_LOADED: {
      return {
        ...state,
        chainID: action.chainID,
      };
    }

    case WEB3_ACCOUNT_DISCONNECTED: {
      return {
        ...state,
        account: action.account,
        initialized: false,
        // initializing: false,
        ens: undefined,
      };
    }

    case WEB3_ACCOUNT_LOADED: {
      return {
        ...state,
        account: action.account,
      };
    }

    case ENS_NAME_LOADED: {
      return {
        ...state,
        ens: action.ens,
      };
    }
    default:
      return state;
  }
};
