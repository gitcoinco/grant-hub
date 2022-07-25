import { Dispatch } from "redux";
import { ethers } from "ethers";
import { ProgramMetadata } from "../types";
import { global } from "../global";
import PinataClient from "../services/pinata";
import ProgramABI from "../contracts/abis/Program.json";

export type ProgramActions =
  | ProgramLoadingAction
  | ProgramLoadedAction
  | ProgramsUnloadedAction
  | ProgramLoadingError;

export const PROGRAM_LOADING = "PROGRAM_LOADING";
export interface ProgramLoadingAction {
  type: typeof PROGRAM_LOADING;
  address: string;
}

export const PROGRAM_LOADED = "PROGRAM_LOADED";
export interface ProgramLoadedAction {
  type: typeof PROGRAM_LOADED;
  address: string;
  program: ProgramMetadata;
}

export const PROGRAM_UNLOADED = "PROGRAM_UNLOADED";

export const programUnloaded = (): ProgramActions => ({
  type: PROGRAM_UNLOADED,
});

export interface ProgramsUnloadedAction {
  type: typeof PROGRAM_UNLOADED;
}

export const unloadProgram = () => programUnloaded();

export const PROGRAM_LOADING_ERROR = "PROGRAM_LOADING_ERROR";
interface ProgramLoadingError {
  type: typeof PROGRAM_LOADING_ERROR;
  address: string;
  error: string;
}

const loadingError = (address: string, error: string): ProgramActions => ({
  type: PROGRAM_LOADING_ERROR,
  address,
  error,
});

export const loadProgram = (address: string) => async (dispatch: Dispatch) => {
  const signer = global.web3Provider!.getSigner();
  const contract = new ethers.Contract(address, ProgramABI, signer);
  const pinataClient = new PinataClient();
  dispatch({
    type: PROGRAM_LOADING,
    address,
  });
  try {
    const programMetaPtr = await contract.metaPtr();

    const resp = await pinataClient.fetchText(programMetaPtr.pointer);
    const programMetadata = JSON.parse(resp);

    dispatch({
      type: PROGRAM_LOADED,
      address,
      program: programMetadata,
    });
  } catch (e) {
    dispatch(loadingError(address, "error loading program metadata"));
    console.error(e);
  }
};
