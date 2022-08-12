import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { roundApplicationPath } from "../../routes";
import { loadRound, unloadRounds } from "../../actions/rounds";
import { Status } from "../../reducers/rounds";
import { networkPrettyName } from "../../utils/wallet";

function Round() {
  const params = useParams();
  const dispatch = useDispatch();

  const { roundId, chainId } = params;

  const props = useSelector((state: RootState) => {
    const roundState = state.rounds[roundId!];
    const status = roundState ? roundState.status : Status.Undefined;
    const error = roundState ? roundState.error : undefined;
    const round = roundState ? roundState.round : undefined;
    const web3ChainId = state.web3.chainID;
    const roundChainId = Number(chainId);

    return {
      roundState,
      status,
      error,
      round,
      web3ChainId,
      roundChainId,
    };
  }, shallowEqual);

  useEffect(() => {
    if (roundId !== undefined) {
      dispatch(unloadRounds());
      dispatch(loadRound(roundId));
    }
  }, [dispatch, roundId]);

  if (props.web3ChainId !== props.roundChainId) {
    return (
      <p>
        This application has been deployed to{" "}
        {networkPrettyName(props.roundChainId)} and you are connected to{" "}
        {networkPrettyName(props.web3ChainId ?? 1)}
      </p>
    );
  }

  if (props.status === Status.Error) {
    return <p>Error: {props.error}</p>;
  }

  if (props.status !== Status.Loaded) {
    return <p>loading...</p>;
  }

  if (props.roundState === undefined || props.round === undefined) {
    return <p>something went wrong</p>;
  }

  return (
    <div>
      <h4>Round #{roundId} Application</h4>
      <p>Raw Round</p>
      <pre>{JSON.stringify(props.round, null, 2)}</pre>
      <Link to={roundApplicationPath(chainId, roundId!)}>
        Apply to this round
      </Link>
    </div>
  );
}

export default Round;
