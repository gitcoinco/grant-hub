import { Outlet, useOutletContext } from "react-router-dom";
import { useAccount, useEnsName, useNetwork } from "wagmi";

import { Web3Instance } from "../../types";
import WalletConnectionButton from "./WalletConnectButton";

/**
 * Component for protecting child routes that require web3 wallet instance.
 * It prompts a user to connect wallet if no web3 instance is found.
 */
export default function Auth() {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { chain } = useNetwork();

  const data = {
    address: ensName ?? address,
    chain: { id: chain?.id, name: chain?.name, network: chain?.network },
  };

  return !isConnected ? (
    <div>
      <main>
        {isConnecting ? (
          <div>Conecting Wallet...</div>
        ) : (
          <div className="container mx-auto flex flex-row bg-white">
            <div className="basis-1/2 m-auto">
              <h1 className="mb-6">Round Manager</h1>
              <p className="text-2xl my-2 text-grey-400">
                As a round operator you can manage high-impact
                <br />
                grant programs and distribute funds across different
                <br />
                rounds and voting mechanisms.
              </p>
              <WalletConnectionButton />
            </div>
          </div>
        )}
      </main>
    </div>
  ) : (
    <Outlet context={data} />
  );
}

/**
 * Wrapper hook to expose wallet auth information to other components
 */
export function useWallet() {
  return useOutletContext<Web3Instance>();
}
