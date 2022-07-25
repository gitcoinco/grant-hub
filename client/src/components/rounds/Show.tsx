import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { roundApplicationPath } from "../../routes";
import { loadRound, unloadRounds } from "../../actions/rounds";
import { Status } from "../../reducers/rounds";
import { formatDate } from "../../utils/components";
import Button, { ButtonVariants } from "../base/Button";
import { loadProgram } from "../../actions/program";

function Round() {
  const params = useParams();
  const dispatch = useDispatch();

  const props = useSelector((state: RootState) => {
    const { roundId, programId } = params;
    const roundState = state.rounds[roundId!];
    const programState = state.programs[programId!];
    const status = roundState ? roundState.status : Status.Empty;

    const error =
      roundState && programState && roundState.error && programState.error;
    const round = roundState ? roundState.round : undefined;
    return {
      roundId,
      programId,
      roundState,
      programState,
      status,
      error,
      round,
    };
  }, shallowEqual);

  useEffect(() => {
    if (props.roundId !== undefined) {
      dispatch(unloadRounds());
      dispatch(loadRound(props.roundId));
    }
    if (props.programId !== undefined) {
      dispatch(unloadRounds());
      dispatch(loadProgram(props.programId));
    }
  }, [dispatch, props.roundId]);

  if (props.status === Status.Error) {
    return <div>Error: {props.error}</div>;
  }

  if (props.status !== Status.Loaded) {
    return <div>loading...</div>;
  }

  if (props.roundState === undefined || props.round === undefined) {
    return <div>something went wrong</div>;
  }

  return (
    <div className="min-h-full absolute flex flex-col justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center text-left grow">
        <div className="text-left w-full">
          <h2 className="text-center">{props.programState.program?.name}</h2>
          <h4 className="text-center">{props.round.roundMetadata.name}</h4>

          <div className="p-8 min-w-1/3">
            {/* Need Info from RM */}
            {/* <p className="my-4">
              Get your project funded through Optimism Public Goods Funding
              Round 1!
            </p> */}
            {/* Need Info from RM */}
            {/* <p className="my-4">Matching Funds Available: $fundssss</p> */}
            <p className="mt-4 mb-12">
              Date: {formatDate(props.round.applicationsStartTime)} -{" "}
              {formatDate(props.round.applicationsEndTime)}
            </p>
            <Link to={roundApplicationPath(params.programId!, params.roundId!)}>
              <Button
                styles={["w-full justify-center"]}
                variant={ButtonVariants.primary}
              >
                Apply to this round
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Round;
