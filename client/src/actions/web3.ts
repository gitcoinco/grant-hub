import { ethers } from "ethers";
import { Dispatch } from "redux";
import { global } from "../global";
import { RootState } from "../reducers";

enum Web3Type {
  Generic,
  Remote,
  Status,
}

export const WEB3_INITIALIZING = "WEB3_INITIALIZING";
export interface Web3InitializingAction {
  type: typeof WEB3_INITIALIZING;
}

export const WEB3_INITIALIZED = "WEB3_INITIALIZED";
export interface Web3InitializedAction {
  type: typeof WEB3_INITIALIZED;
  web3Type: Web3Type;
}

export const WEB3_ERROR = "WEB3_ERROR";
export interface Web3ErrorAction {
  type: typeof WEB3_ERROR;
  error: string;
}

export const WEB3_CHAIN_ID_LOADED = "WEB3_CHAIN_ID_LOADED";
export interface Web3ChainIDLoadedAction {
  type: typeof WEB3_CHAIN_ID_LOADED;
  chainID: number;
}

export const WEB3_ACCOUNT_DISCONNECTED = "WEB3_ACCOUNT_DISCONNECTED";
export interface Web3AccountDisconnectedAction {
  type: typeof WEB3_ACCOUNT_DISCONNECTED;
  account: string;
}

export const WEB3_ACCOUNT_LOADED = "WEB3_ACCOUNT_LOADED";
export interface Web3AccountLoadedAction {
  type: typeof WEB3_ACCOUNT_LOADED;
  account: string;
}

export const ENS_NAME_LOADED = "ENS_NAME_LOADED";
export interface EnsLoadedAction {
  type: typeof ENS_NAME_LOADED;
  ens: string;
}

export type Web3Actions =
  | Web3InitializingAction
  | Web3InitializedAction
  | Web3ErrorAction
  | Web3ChainIDLoadedAction
  | Web3AccountDisconnectedAction
  | Web3AccountLoadedAction
  | EnsLoadedAction;

export const web3Initializing = (): Web3Actions => ({
  type: WEB3_INITIALIZING,
});

export const web3Initialized = (t: Web3Type): Web3Actions => ({
  type: WEB3_INITIALIZED,
  web3Type: t,
});

export const web3ChainIDLoaded = (id: number): Web3Actions => ({
  type: WEB3_CHAIN_ID_LOADED,
  chainID: id,
});

export const web3Error = (error: string): Web3Actions => ({
  type: WEB3_ERROR,
  error,
});

export const web3AccountLoaded = (account: string): Web3Actions => ({
  type: WEB3_ACCOUNT_LOADED,
  account,
});

export const ensLoaded = (ens: string): Web3Actions => ({
  type: ENS_NAME_LOADED,
  ens,
});

export const web3AccountDisconnected = (account: string): Web3Actions => ({
  type: WEB3_ACCOUNT_DISCONNECTED,
  account,
});

export const notWeb3Browser = (): Web3Actions => ({
  type: WEB3_ERROR,
  error: "not a web3 browser",
});

// Moved to react-app-env.d.ts
// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }

const loadWeb3Data = (chainId: number) => (dispatch: Dispatch) => {
  console.log("Loading chainId...");
  global.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  dispatch(web3ChainIDLoaded(chainId));
};

export const loadAccountData = (account: string) => (dispatch: Dispatch) => {
  const t: Web3Type = window.ethereum.isStatus
    ? Web3Type.Status
    : Web3Type.Generic;
  dispatch(web3Initialized(t));
  dispatch(web3AccountLoaded(account));
};

export const loadEnsData = (ens: string) => (dispatch: Dispatch) => {
  dispatch(ensLoaded(ens));
};

export const initializeWeb3 = (chainId: number) => {
  console.log("Initializing wallet...");
  if (window.ethereum) {
    return (dispatch: Dispatch, getState: () => RootState) => {
      const state = getState();
      if (state.web3.initializing || state.web3.initialized) {
        return;
      }

      dispatch(web3Initializing());
      dispatch<any>(loadWeb3Data(chainId));
    };
  }
  return notWeb3Browser();
};
