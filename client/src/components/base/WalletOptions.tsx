import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useConnect } from "wagmi";
import { initializeWeb3 } from "../../actions/web3";
import { RootState } from "../../reducers";
import Button, { ButtonVariants } from "./Button";

export type WalletOptionsProps = {
  address: string | undefined;
  isDisconnected: boolean;
};

const WalletOptions = ({
  address,
  isDisconnected,
}: WalletOptionsProps): JSX.Element => {
  const dispatch = useDispatch();
  const { connect, connectors, error, isLoading, pendingConnector, status } =
    useConnect();

  function exportState() {
    return useSelector((state: RootState) => state);
  }

  const props = useSelector(
    (state: RootState) => ({
      web3Initializing: state.web3.initializing,
      web3Initialized: state.web3.initialized,
      web3Error: state.web3.error,
      chainID: state.web3.chainID,
      account: state.web3.account,
    }),
    shallowEqual
  );

  console.log("props", props);
  console.log("state", exportState());

  if (isDisconnected || address === undefined) {
    return (
      <div className="content-center">
        {connectors.map((connector) => {
          return (
            <Button
              styles={["w-full sm:w-auto mx-w-full ml-0 p-2"]}
              variant={ButtonVariants.primary}
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                connect({ connector });
                // dispatch(initializeWeb3());
              }}
            >
              {connector.name}
              {!connector.ready && " (unsupported"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </Button>
          );
        })}

        {error && <div>{error.message}</div>}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default WalletOptions;
