import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRoundApplicationMetadata,
  getRoundMetadata,
} from "../../actions/rounds";
import { useClients } from "../../hooks/useDataClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  BaseRound,
  useFetchRoundByAddress,
} from "../../services/graphqlClient";
import colors from "../../styles/colors";
import { Round } from "../../types";
import Form from "../application/Form";
import Button, { ButtonVariants } from "../base/Button";
import ExitModal from "../base/ExitModal";
import TextLoading from "../base/TextLoading";
import Cross from "../icons/Cross";

const formatDate = (unixTS: number) =>
  new Date(unixTS).toLocaleDateString(undefined);

function Apply() {
  const params = useParams();
  // const navigate = useNavigate();
  const [roundToApply, setRoundToApply] = useLocalStorage("roundToApply", null);
  const { roundManagerClient } = useClients();
  const [loading, setLoading] = useState(true);
  const [roundData, setRoundData] = useState<BaseRound>();

  const [modalOpen, toggleModal] = useState(false);

  // const { roundId, chainId } = params;

  /*
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

    return {
      roundState,
      roundStatus,
      roundError,
      round,
      applicationStatus,
      applicationError,
      applicationMetadata: round?.applicationMetadata,
    };
  }, shallowEqual);
  */

  useEffect(() => {
    if (params.id !== undefined) {
      // && props.round === undefined) {
      // navigate(roundPath(params.id));
      setRoundToApply(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    console.log("roundToApply", roundToApply);
  }, [roundToApply]);

  async function fetchRound() {
    if (!roundManagerClient) return;
    const roundInfo = await useFetchRoundByAddress(
      roundManagerClient,
      params.id!
    );

    if (!roundInfo) {
      console.error("Cannot load round", params.id);
      return;
    }

    const roundApplicationMetadata = await getRoundApplicationMetadata(
      roundInfo.round.applicationMetaPtr.pointer
    );

    if (!roundApplicationMetadata) {
      console.error("Cannot load round application metadata", params.id);
      return;
    }

    const roundMetadata = await getRoundMetadata(
      roundInfo.round.roundMetaPtr.pointer
    );

    if (!roundMetadata) {
      console.error("Cannot load round metadata", params.id);
      return;
    }

    roundInfo.round.applicationMetadata = roundApplicationMetadata;
    roundInfo.round.metadata = roundMetadata;
    setRoundData(roundInfo.round);
    setLoading(false);
  }

  useEffect(() => {
    fetchRound();
  }, [params.id, roundManagerClient]);

  /*
  if (props.roundStatus === RoundStatus.Error) {
    return <div>Error loading round data: {props.roundError}</div>;
  }

  if (props.roundStatus !== RoundStatus.Loaded) {
    return <div>loading...</div>;
  }

  if (props.roundState === undefined || props.round === undefined) {
    return <div>something went wrong</div>;
  }

  if (props.applicationStatus === ApplicationStatus.Error) {
    return (
      <div>Error submitting round application: {props.applicationError}</div>
    );
  }

  if (props.applicationStatus === ApplicationStatus.Sent) {
    setRoundToApply(null);
    return <div>Applied to round successfully.</div>;
  }

  if (props.applicationStatus !== ApplicationStatus.Undefined) {
    return <div>sending application...</div>;
  }
*/
  function roundTimeInfo(): JSX.Element {
    if (
      roundData &&
      roundData.applicationsStartTime &&
      roundData.applicationsEndTime
    ) {
      return (
        <>
          {formatDate(Number(roundData.applicationsStartTime))} -{" "}
          {formatDate(Number(roundData.applicationsEndTime))}{" "}
        </>
      );
    }
    return <TextLoading />;
  }

  // TODO(@DanieleSalatti): refactor data types - this should not be needed
  function roundFromGraphData(base: BaseRound): Round {
    const round: Round = {
      address: base.id,
      applicationsStartTime: Number(base.applicationsStartTime),
      applicationsEndTime: Number(base.applicationsEndTime),
      roundStartTime: Number(base.roundStartTime),
      roundEndTime: Number(base.roundEndTime),
      token: base.token,
      roundMetaPtr: {
        pointer: base.roundMetaPtr.pointer,
        protocol: base.roundMetaPtr.protocol.toString(),
      },
      roundMetadata: base.metadata!,
      applicationMetaPtr: {
        pointer: base.applicationMetaPtr.pointer,
        protocol: base.applicationMetaPtr.protocol.toString(),
      },
      applicationMetadata: base.applicationMetadata!,
    };
    return round;
  }

  return (
    <div className="mx-4">
      {loading || !roundData ? (
        <TextLoading />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between">
            <h3 className="mb-2">Grant Application</h3>

            <div className="w-full mb-2 inline-block sm:hidden">
              <p>Make sure to Save &amp; Exit, so your changes are saved.</p>
            </div>
            <Button
              variant={ButtonVariants.outlineDanger}
              onClick={() => toggleModal(true)}
              styles={["w-full sm:w-auto mx-w-full ml-0"]}
            >
              <i className="icon mt-1.5">
                <Cross color={colors["danger-background"]} />
              </i>{" "}
              <span className="pl-2">Exit</span>
            </Button>
          </div>
          <div className="w-full flex">
            <div className="w-full md:w-1/3 mb-2 hidden sm:inline-block">
              <p className="font-semibold">Your Grant Application to:</p>
              <p>{roundData?.metadata?.name}</p>
              <p>{roundTimeInfo()}</p>
            </div>
            <div className="w-full md:w-2/3">
              {roundData.applicationMetadata === undefined && (
                <div>loading form...</div>
              )}
              {roundData.applicationMetadata !== undefined && (
                <Form
                  roundApplication={roundData.applicationMetadata}
                  round={roundFromGraphData(roundData)}
                />
              )}
            </div>
          </div>

          <ExitModal modalOpen={modalOpen} toggleModal={toggleModal} />
        </>
      )}
    </div>
  );
}

export default Apply;
