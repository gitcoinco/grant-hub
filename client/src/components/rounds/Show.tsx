import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { roundApplicationPath } from "../../routes";
import { loadRound, unloadRounds } from "../../actions/rounds";
import { Status } from "../../reducers/rounds";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useFetchRoundByAddress } from "../../services/graphqlClient";

function Round() {
  const params = useParams();
  const dispatch = useDispatch();
  const [roundToApply, setRoundToApply] = useLocalStorage("roundToApply", null);
  // const [roundInfo] = useState<RoundResponse | null>(null);

  const props = useSelector((state: RootState) => {
    const { id } = params;
    const roundState = state.rounds[id!];
    const status = roundState ? roundState.status : Status.Undefined;
    const error = roundState ? roundState.error : undefined;
    const round = roundState ? roundState.round : undefined;
    return {
      id,
      roundState,
      status,
      error,
      round,
      chainID: state.web3.chainID,
    };
  }, shallowEqual);

  const roundInfo = useFetchRoundByAddress(props.id!);

  console.log("Round Info", roundInfo);

  useEffect(() => {
    if (props.id !== undefined && roundInfo) {
      dispatch(unloadRounds());
      dispatch(loadRound(roundInfo));
    }
  }, [dispatch, props.id, roundInfo?.round.id]);

  useEffect(() => {
    if (props.id) {
      setRoundToApply(props.id);
    }
  }, [props.roundState]);

  useEffect(() => {
    console.log("roundToApply", roundToApply);
  }, [roundToApply]);

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
    <div>
      <h4>Round #{props.id} Application</h4>
      <p>Raw Round</p>
      <pre>{JSON.stringify(props.round, null, 2)}</pre>
      <Link to={roundApplicationPath(params.id!)}>Apply to this round</Link>
    </div>
  );
}

export default Round;
