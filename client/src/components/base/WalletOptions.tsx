import { useState } from "react";
import { useSelector } from "react-redux";
import { useAccount, useConnect } from "wagmi";
import { RootState } from "../../reducers";
import Button, { ButtonVariants } from "./Button";

export type WalletOptionsProps = {};

const WalletOptions = ({}: WalletOptionsProps): JSX.Element => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [state, setState] = useState({});

  function exportState() {
    return useSelector((state: RootState) => state);
  }

	console.log('state', exportState())

  return (
    <div className="">
      {connectors.map((connector) => {
        return (
          <Button
            styles={["w-full sm:w-auto mx-w-full ml-0 p-2"]}
            variant={ButtonVariants.primary}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => {
              connect({ connector });
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
};

export default WalletOptions;
