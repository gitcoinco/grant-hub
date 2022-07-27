import { useConnect } from "wagmi";

const WalletOptions = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  return (
    <div>
      {connectors.map((connector) => {
        return (
          <button
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
          </button>
        );
      })}

      {error && <div>{error.message}</div>}
    </div>
  );
};

export default WalletOptions;
