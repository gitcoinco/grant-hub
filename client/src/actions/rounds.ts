import { Dispatch } from "redux";
// import { RootState } from "../reducers";
import { datadogRum } from "@datadog/browser-rum";
import { BigNumber, ethers } from "ethers";
import ProgramABI from "../contracts/abis/ProgramImplementation.json";
import RoundABI from "../contracts/abis/RoundImplementation.json";
import { RootState } from "../reducers";
import { Status } from "../reducers/rounds";
import PinataClient from "../services/pinata";
import {
  MetaPtr,
  ProgramMetadata,
  Round,
  RoundApplicationMetadata,
  RoundMetadata,
} from "../types";
import { getProviderByChainId } from "../utils/utils";

const projectQuestion = {
  question: "Select a project you would like to apply for funding:",
  type: "PROJECT", // this will be a limited set [TEXT, TEXTAREA, RADIO, MULTIPLE]
  required: true,
};

const recipientAddressQuestion = {
  question: "Recipient Address",
  type: "RECIPIENT",
  required: true,
  info: "Address that will receive funds",
};

export const ROUNDS_LOADING_ROUND = "ROUNDS_LOADING_ROUND";
interface RoundsLoadingRoundAction {
  type: typeof ROUNDS_LOADING_ROUND;
  address: string;
  status: Status;
}

export const ROUNDS_ROUND_LOADED = "ROUNDS_ROUND_LOADED";
interface RoundsRoundLoadedAction {
  type: typeof ROUNDS_ROUND_LOADED;
  address: string;
  round: Round;
}

export const ROUNDS_UNLOADED = "ROUNDS_UNLOADED";
interface RoundsUnloadedAction {
  type: typeof ROUNDS_UNLOADED;
}

export const ROUNDS_LOADING_ERROR = "ROUNDS_LOADING_ERROR";
interface RoundsLoadingErrorAction {
  type: typeof ROUNDS_LOADING_ERROR;
  address: string;
  error: string;
}

export const ROUND_STATS_LOADING = "ROUND_STATS_LOADING";
interface RoundStatsLoadingAction {
  type: typeof ROUND_STATS_LOADING;
}

export const ROUND_STATS_LOADED = "ROUND_STATS_LOADED";
interface RoundStatsLoadedAction {
  type: typeof ROUND_STATS_LOADED;
  roundId: string;
  stats: [];
}

export const ROUND_STATS_ERROR = "ROUND_STATS_ERROR";
interface RoundStatsErrorAction {
  type: typeof ROUND_STATS_ERROR;
  error: any;
}

export type RoundsActions =
  | RoundsLoadingRoundAction
  | RoundsRoundLoadedAction
  | RoundsUnloadedAction
  | RoundsLoadingErrorAction
  | RoundStatsLoadingAction
  | RoundStatsLoadedAction
  | RoundStatsErrorAction;

export const roundLoaded = (address: string, round: Round): RoundsActions => ({
  type: ROUNDS_ROUND_LOADED,
  address,
  round,
});

const roundsUnloaded = (): RoundsActions => ({
  type: ROUNDS_UNLOADED,
});

const loadingError = (address: string, error: string): RoundsActions => ({
  type: ROUNDS_LOADING_ERROR,
  address,
  error,
});

const roundStatsLoaded = (roundId: string, stats: []): RoundsActions => ({
  type: ROUND_STATS_LOADED,
  roundId,
  stats,
});

const roundStatsError = (error: any): RoundsActions => ({
  type: ROUND_STATS_ERROR,
  error,
});

export const unloadRounds = () => roundsUnloaded();

export const loadRound =
  (address: string, roundChainId?: number) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // address validation
      ethers.utils.getAddress(address);
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "invalid address or address checksum"));
      console.error(e);
      return;
    }

    const state = getState();
    const { chainID: stateChainID } = state.web3;

    const chainId = roundChainId || stateChainID;

    const appProvider = getProviderByChainId(chainId!);

    const contract = new ethers.Contract(address, RoundABI, appProvider);
    const pinataClient = new PinataClient();

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingApplicationsStartTime,
    });

    let applicationsStartTime;
    try {
      const ast: BigNumber = await contract.applicationsStartTime();
      applicationsStartTime = ast.toNumber();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading application start time"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingApplicationsEndTime,
    });

    let applicationsEndTime;
    try {
      const aet: BigNumber = await contract.applicationsEndTime();
      applicationsEndTime = aet.toNumber();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading application end time"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingRoundStartTime,
    });

    let roundStartTime;
    try {
      const rst: BigNumber = await contract.roundStartTime();
      roundStartTime = rst.toNumber();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading round start time"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingRoundEndTime,
    });

    let roundEndTime;
    try {
      const ret: BigNumber = await contract.roundEndTime();
      roundEndTime = ret.toNumber();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading round end time"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingToken,
    });

    let token;
    try {
      token = await contract.token();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading round token"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingRoundMetaPtr,
    });

    let roundMetaPtr: MetaPtr;
    try {
      roundMetaPtr = await contract.roundMetaPtr();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading round metaPtr"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingRoundMetadata,
    });

    let roundMetadata: RoundMetadata;
    try {
      const resp = await pinataClient.fetchText(roundMetaPtr.pointer);
      roundMetadata = JSON.parse(resp);
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading round metadata"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingApplicationMetaPtr,
    });

    let applicationMetaPtr: MetaPtr;
    try {
      applicationMetaPtr = await contract.applicationMetaPtr();
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading application metaPtr"));
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address,
      status: Status.LoadingApplicationMetadata,
    });

    let applicationMetadata: RoundApplicationMetadata;
    let projectQuestionId;
    let recipientQuestionId;
    try {
      const resp = await pinataClient.fetchText(applicationMetaPtr.pointer);
      applicationMetadata = JSON.parse(resp);

      if (applicationMetadata.applicationSchema === undefined) {
        applicationMetadata.applicationSchema =
          applicationMetadata.application_schema;
      }

      recipientQuestionId = applicationMetadata.applicationSchema.length;
      applicationMetadata.applicationSchema.unshift({
        ...recipientAddressQuestion,
        id: recipientQuestionId,
      });
      applicationMetadata.recipientQuestionId = recipientQuestionId;

      projectQuestionId = applicationMetadata.applicationSchema.length;
      applicationMetadata.applicationSchema.unshift({
        ...projectQuestion,
        id: projectQuestionId,
      });
      applicationMetadata.projectQuestionId = projectQuestionId;
    } catch (e) {
      datadogRum.addError(e);
      dispatch(loadingError(address, "error loading application metadata"));
      console.error(e);
      return;
    }

    let programName = "";

    if (roundMetadata.programContractAddress !== undefined) {
      const programContract = new ethers.Contract(
        roundMetadata.programContractAddress,
        ProgramABI,
        appProvider
      );

      dispatch({
        type: ROUNDS_LOADING_ROUND,
        address,
        status: Status.LoadingProgramMetaPtr,
      });

      let programMetaPtr: MetaPtr;
      try {
        programMetaPtr = await programContract.metaPtr();
      } catch (e) {
        datadogRum.addError(e);
        dispatch(loadingError(address, "error loading program metaPtr"));
        console.error(e);
        return;
      }

      dispatch({
        type: ROUNDS_LOADING_ROUND,
        address,
        status: Status.LoadingProgramMetadata,
      });

      let programMetadata: ProgramMetadata;
      try {
        const resp = await pinataClient.fetchText(programMetaPtr.pointer);
        programMetadata = JSON.parse(resp);
        programName = programMetadata.name;
      } catch (e) {
        datadogRum.addError(e);
        dispatch(loadingError(address, "error loading program metadata"));
        console.error(e);
        return;
      }
    }

    const round = {
      address,
      applicationsStartTime,
      applicationsEndTime,
      roundStartTime,
      roundEndTime,
      token,
      roundMetaPtr: {
        protocol: BigNumber.from(roundMetaPtr.protocol).toString(),
        pointer: roundMetaPtr.pointer,
      },
      roundMetadata,
      applicationMetaPtr: {
        protocol: BigNumber.from(applicationMetaPtr.protocol).toString(),
        pointer: applicationMetaPtr.pointer,
      },
      applicationMetadata,
      programName,
    };

    dispatch(roundLoaded(address, round));
  };

export const loadRoundStats =
  (roundId: string, roundChainId: number) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    // todo: fetch the stats for the round
    dispatch({ type: ROUND_STATS_LOADING });
    console.log("JER loadRoundStats", { roundId, state });

    try {
      // todo: make the api/graph call
      const roundStats: [] = [];
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(
        `https://staging.grants.gitcoin.co/api/v1/data/summary/round/${roundChainId}/${roundId}`,
        options
      )
        .then((response) => response.json())
        .then((data) => console.log("JER DATA", { data }));

      dispatch(roundStatsLoaded(roundId, roundStats));
    } catch (error) {
      console.error(error);
      dispatch(roundStatsError(error));
    }
  };
