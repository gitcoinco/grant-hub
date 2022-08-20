import { useEffect } from "react";
import toast from "react-hot-toast/headless";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { loadAccountData } from "../actions/web3";
import { RootState } from "../reducers";
import { isValidAddress } from "../utils/wallet";
import Notifications from "./base/Notifications";
import Landing from "./grants/Landing";
import Header from "./Header";

interface Props {
  children: JSX.Element;
}

function Layout({ children }: Props) {
  const dispatch = useDispatch();
  const props = useSelector(
    (state: RootState) => ({
      web3Error: state.web3.error,
      chainId: state.web3.chainID,
    }),
    shallowEqual
  );
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount({
    onConnect({ address: addr }) {
      dispatch<any>(loadAccountData(addr!));
    },
  });

  useEffect(() => {
    toast(
      <div>
        <p className="font-semibold text-quaternary-text">Wallet Connected!</p>
        <p className="text-quaternary-text">Welcome to your Grant Hub.</p>
      </div>,
      { id: "hello-world", duration: 3000 }
    );
    if (!props.chainId) {
      dispatch<any>({ type: "WEB3_CHAIN_ID_LOADED", chainID: chain?.id });
    }
  }, [isConnected]);

  if (!isValidAddress(address) || address === undefined) {
    return <Landing />;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="container mx-auto dark:bg-primary-background grow relative">
        {!props.web3Error && isConnected && chain?.id && children}
        {props.web3Error && <p>{props.web3Error}</p>}
      </main>
      <Notifications />
      <div className="h-1/8">
        <div className="w-full flex justify-center py-4">
          <img
            alt="Built by the Gitcoin Community"
            src="./assets/footer-img.svg"
          />
        </div>
      </div>
    </div>
  );
}

export default Layout;
