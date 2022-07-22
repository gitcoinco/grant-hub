import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { roundApplicationPath } from "../../routes";
import { loadRound, unloadRounds } from "../../actions/rounds";
import { Status } from "../../reducers/rounds";
import { formatDate } from "../../utils/components";
import Button, { ButtonVariants } from "../base/Button";

function Round() {
  const params = useParams();
  const dispatch = useDispatch();

  const props = useSelector((state: RootState) => {
    const { id } = params;
    const roundState = state.rounds[id!];
    const status = roundState ? roundState.status : Status.Empty;
    const error = roundState ? roundState.error : undefined;
    const round = roundState ? roundState.round : undefined;
    return {
      id,
      roundState,
      status,
      error,
      round,
    };
  }, shallowEqual);

  useEffect(() => {
    if (props.id !== undefined) {
      dispatch(unloadRounds());
      dispatch(loadRound(props.id));
    }
  }, [dispatch, props.id]);

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
        <div className="text-left w-full sm:w-1/2 ">
          <h2 className="text-center">Optimism</h2>
          <h4 className="text-center">{props.round.roundMetadata.name}</h4>

          <div className="p-8">
            {/* Need Info from RM */}
            <p className="my-4">
              Get your project funded through Optimism Public Goods Funding
              Round 1!
            </p>
            {/* Need Info from RM */}
            <p className="my-4">Matching Funds Available: $fundssss</p>
            <p className="mt-4 mb-12">
              Date: {formatDate(props.round.applicationsStartTime)} -{" "}
              {formatDate(props.round.applicationsEndTime)}
            </p>
            <Link to={roundApplicationPath(params.id!)}>
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
