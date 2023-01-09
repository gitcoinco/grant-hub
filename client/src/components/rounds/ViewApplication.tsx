import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApplicationData } from "../../actions/roundApplication";
import { loadRound, unloadRounds } from "../../actions/rounds";
import { RootState } from "../../reducers";
import { Status as ApplicationStatus } from "../../reducers/roundApplication";
import { Status as RoundStatus } from "../../reducers/rounds";
import { grantsPath } from "../../routes";
import Form from "../application/Form";
import ErrorModal from "../base/ErrorModal";

const formatDate = (unixTS: number) =>
  new Date(unixTS).toLocaleDateString(undefined);

// TODO: dispatch load round in case user gets here directly

function ViewApplication() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chainId, roundId, ipfsHash } = params;

  const props = useSelector((state: RootState) => {
    const roundState = state.rounds[roundId!];
    const roundStatus = roundState ? roundState.status : RoundStatus.Undefined;
    const applicationState = state.roundApplication[roundId!];
    const applicationStatus: ApplicationStatus = applicationState
      ? applicationState.status
      : ApplicationStatus.Undefined;

    const roundError = roundState ? roundState.error : undefined;
    const round = roundState ? roundState.round : undefined;

    const applicationError = applicationState
      ? applicationState.error
      : undefined;
    const showErrorModal =
      applicationError && applicationStatus === ApplicationStatus.Error;

    const publishedApplicationMetadata = applicationState
      ? applicationState.metadataFromIpfs![ipfsHash!]
      : null;

    console.log("DASA roundState", roundState);
    console.log("DASA applicationState", applicationState);
    console.log(
      "DASA publishedApplicationMetadata",
      publishedApplicationMetadata
    );

    const web3ChainId = state.web3.chainID;
    const roundChainId = Number(chainId);

    return {
      roundState,
      roundStatus,
      roundError,
      round,
      applicationState,
      applicationStatus,
      applicationError,
      applicationMetadata: round?.applicationMetadata,
      publishedApplicationMetadata,
      showErrorModal,
      web3ChainId,
      roundChainId,
    };
  }, shallowEqual);

  console.log("DASA params", params);

  const isOnRoundChain = props.web3ChainId === props.roundChainId;

  useEffect(() => {
    if (!isOnRoundChain) return;

    if (roundId !== undefined) {
      dispatch(unloadRounds());
      dispatch(loadRound(roundId));
    }
  }, [dispatch, roundId]);

  useEffect(() => {
    if (!isOnRoundChain) return;

    if (!props.round) return;

    if (params.ipfsHash !== undefined) {
      dispatch(fetchApplicationData(ipfsHash!, roundId!));
    }
  }, [dispatch, params.ipfsHash, props.round]);

  if (props.roundStatus === RoundStatus.Error) {
    <div>
      <ErrorModal
        open
        primaryBtnText="Refresh Page"
        secondaryBtnText="Close"
        onClose={() => navigate(grantsPath())}
        onRetry={() => navigate(0)}
      >
        <>
          There has been an error loading the grant round data. Please try
          refreshing the page. If the issue persists, please reach out to us on{" "}
          <a
            target="_blank"
            className="text-gitcoin-violet-400 outline-none"
            href="https://discord.com/invite/gitcoin"
            rel="noreferrer"
          >
            Discord.
          </a>
        </>
      </ErrorModal>
    </div>;
  }

  if (props.publishedApplicationMetadata === null) {
    return <div>loading...</div>;
  }

  if (props.roundState === undefined || props.round === undefined) {
    return (
      <div>
        <ErrorModal
          open
          primaryBtnText="Close"
          secondaryBtnText="Refresh Page"
          onRetry={() => navigate(grantsPath())}
          onClose={() => navigate(0)}
        >
          <>
            There has been an error loading the grant round data. Please try
            refreshing the page. If the issue persists, please reach out to us
            on{" "}
            <a
              target="_blank"
              className="text-gitcoin-violet-400 outline-none"
              href="https://discord.com/invite/gitcoin"
              rel="noreferrer"
            >
              Discord.
            </a>
          </>
        </ErrorModal>
      </div>
    );
  }

  return (
    <div className="mx-4">
      <div className="flex flex-col sm:flex-row justify-between">
        <h3 className="mb-2">Grant Round Application</h3>
      </div>
      <div className="w-full flex">
        <div className="w-full md:w-1/3 mb-2 hidden sm:inline-block">
          <p className="font-semibold">Grant Round</p>
          <p>{props.round.programName}</p>
          <p>{props.round.roundMetadata.name}</p>
          <p className="font-semibold mt-4">Application Period:</p>
          <p>
            {formatDate(props.round.applicationsStartTime * 1000)} -{" "}
            {formatDate(props.round.applicationsEndTime * 1000)}
          </p>
          <p className="font-semibold mt-4">Rounds Date:</p>
          <p>
            {formatDate(props.round.roundStartTime * 1000)} -{" "}
            {formatDate(props.round.roundEndTime * 1000)}
          </p>
          <p className="mt-4">
            Need Help? Check out the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="text-gitcoin-violet-400"
              href="https://support.gitcoin.co/gitcoin-grants-protocol"
            >
              Grants Hub Guide.
            </a>
          </p>
        </div>
        <div className="w-full md:w-2/3">
          {!props.applicationMetadata === undefined && (
            <div>loading form...</div>
          )}
          {props.applicationMetadata !== undefined && (
            <Form
              roundApplication={props.applicationMetadata}
              publishedApplication={
                props.publishedApplicationMetadata.publishedApplicationData
              }
              showErrorModal={props.showErrorModal || false}
              round={props.round}
              onSubmit={() => {}}
              readonly
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewApplication;
