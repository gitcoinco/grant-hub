import { Dispatch } from "redux";
import { Status } from "../reducers/rounds";
import { RoundResponse } from "../services/graphqlClient";
import PinataClient from "../services/pinata";
import { Round, RoundApplicationMetadata, RoundMetadata } from "../types";

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

export type RoundsActions =
  | RoundsLoadingRoundAction
  | RoundsRoundLoadedAction
  | RoundsUnloadedAction
  | RoundsLoadingErrorAction;

const roundLoaded = (address: string, round: Round): RoundsActions => ({
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

export const unloadRounds = () => roundsUnloaded();

export const getRoundMetadata = async (
  pointer: string
): Promise<RoundMetadata | null> => {
  const pinataClient = new PinataClient();
  try {
    const resp = await pinataClient.fetchText(pointer);
    return JSON.parse(resp) as RoundMetadata;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getRoundApplicationMetadata = async (
  pointer: string
): Promise<RoundApplicationMetadata | null> => {
  const pinataClient = new PinataClient();
  try {
    const resp = await pinataClient.fetchText(pointer);
    return JSON.parse(resp) as RoundApplicationMetadata;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const loadRound =
  (roundInfo: RoundResponse) => async (dispatch: Dispatch) => {
    if (
      !roundInfo ||
      roundInfo.round.roundMetaPtr.pointer === undefined ||
      roundInfo.round.applicationMetaPtr.pointer === undefined
    ) {
      dispatch({
        type: ROUNDS_LOADING_ERROR,
        address: roundInfo.round.id,
        error: "Round metadata not found",
      });
      return;
    }
    const pinataClient = new PinataClient();

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address: roundInfo.round.id,
      status: Status.LoadingRoundMetadata,
    });

    let roundMetadata: RoundMetadata;
    try {
      const resp = await pinataClient.fetchText(
        roundInfo.round.roundMetaPtr.pointer
      );
      roundMetadata = JSON.parse(resp);
    } catch (e) {
      dispatch(
        loadingError(roundInfo.round.id, "error loading round metadata")
      );
      console.error(e);
      return;
    }

    dispatch({
      type: ROUNDS_LOADING_ROUND,
      address: roundInfo.round.id,
      status: Status.LoadingApplicationMetadata,
    });

    let applicationMetadata: RoundApplicationMetadata;
    let projectQuestionId;
    let recipientQuestionId;
    try {
      const resp = await pinataClient.fetchText(
        roundInfo.round.applicationMetaPtr.pointer
      );
      applicationMetadata = JSON.parse(resp);

      if (applicationMetadata.applicationSchema === undefined) {
        applicationMetadata.applicationSchema =
          applicationMetadata.application_schema;
      }

      projectQuestionId = applicationMetadata.applicationSchema.length;
      applicationMetadata.applicationSchema.unshift({
        ...projectQuestion,
        id: projectQuestionId,
      });
      applicationMetadata.projectQuestionId = projectQuestionId;

      recipientQuestionId = applicationMetadata.applicationSchema.length;
      applicationMetadata.applicationSchema.push({
        ...recipientAddressQuestion,
        id: recipientQuestionId,
      });
      applicationMetadata.recipientQuestionId = recipientQuestionId;
    } catch (e) {
      dispatch(
        loadingError(roundInfo.round.id, "error loading application metadata")
      );
      console.error(e);
      return;
    }

    const round = {
      address: roundInfo.round.id,
      applicationsStartTime: Number(roundInfo.round.applicationsStartTime),
      applicationsEndTime: Number(roundInfo.round.applicationsEndTime),
      roundStartTime: Number(roundInfo.round.roundStartTime),
      roundEndTime: Number(roundInfo.round.roundEndTime),
      token: roundInfo.round.token,
      roundMetaPtr: {
        protocol: roundInfo.round.roundMetaPtr.protocol.toString(),
        pointer: roundInfo.round.roundMetaPtr.pointer,
      },
      roundMetadata,
      applicationMetaPtr: {
        protocol: roundInfo.round.applicationMetaPtr.protocol.toString(),
        pointer: roundInfo.round.applicationMetaPtr.pointer,
      },
      applicationMetadata,
    };

    dispatch(roundLoaded(roundInfo.round.id, round));
  };
