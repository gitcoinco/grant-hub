import { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { loadAccountData } from "../actions/web3";
import { RootState } from "../reducers";
import colors from "../styles/colors";
import Toast from "./base/Toast";
import Landing from "./grants/Landing";
import Header from "./Header";
import Globe from "./icons/Globe";

interface Props {
  children: JSX.Element;
}

function Layout(ownProps: Props) {
  const [show, showToast] = useState(false);
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
    onConnect({ address: addr, connector, isReconnected }) {
      console.log("Connected =>", { addr, connector, isReconnected });
      dispatch<any>(loadAccountData(addr!));
      // dispatch<any>(initializeWeb3(chain?.id!));
    },
  });

  useEffect(() => {
    showToast(isConnected);
    if (!props.chainId) {
      dispatch<any>({ type: "WEB3_CHAIN_ID_LOADED", chainID: chain?.id });
    }
  }, [isConnected]);

  const { children } = ownProps;
  if (address === undefined) {
    return <Landing />;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="container mx-auto dark:bg-primary-background grow relative">
        {!props.web3Error && isConnected && chain?.id && children}
        {props.web3Error && <p>{props.web3Error}</p>}
      </main>
      <Toast fadeOut show={show} onClose={() => showToast(false)}>
        <>
          <div className="w-6 mt-1 mr-2">
            <Globe color={colors["quaternary-text"]} />
          </div>
          <div>
            <p className="font-semibold text-quaternary-text">
              Wallet Connected!
            </p>
            <p className="text-quaternary-text">Welcome to your Grant Hub.</p>
          </div>
        </>
      </Toast>
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
