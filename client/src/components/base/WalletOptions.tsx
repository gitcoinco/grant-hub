import { useConnect } from "wagmi";
import Button, { ButtonVariants } from "../base/Button";

export type WalletOptionsProps = {};

const WalletOptions = ({}: WalletOptionsProps): JSX.Element => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  return (
    <div>
      {connectors.map((connector) => {
        return (
          <Button
            styles={[]}
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
