import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { RootState } from "../../reducers";
import { slugs } from "../../routes";
import CallbackModal from "../base/CallbackModal";

function Landing() {
  const queryString = new URLSearchParams(window?.location?.search);
  // Twitter oauth will attach code & state in oauth procedure
  const queryError = queryString.get("error");
  const queryCode = queryString.get("code");
  const queryState = queryString.get("state");

  // if Twitter oauth then submit message to other windows and close self
  if (
    (queryError || queryCode) &&
    queryState &&
    /^twitter-.*/.test(queryState)
  ) {
    // shared message channel between windows (on the same domain)
    const channel = new BroadcastChannel("twitter_oauth_channel");
    // only continue with the process if a code is returned
    if (queryCode) {
      channel.postMessage({
        target: "twitter",
        data: { code: queryCode, state: queryState },
      });
    }
    // always close the redirected window
    window.close();

    return <div />;
  }
  // if Github oauth then submit message to other windows and close self
  if (
    (queryError || queryCode) &&
    queryState &&
    /^github-.*/.test(queryState)
  ) {
    // shared message channel between windows (on the same domain)
    const channel = new BroadcastChannel("github_oauth_channel");
    // only continue with the process if a code is returned
    if (queryCode) {
      channel.postMessage({
        target: "github",
        data: { code: queryCode, state: queryState },
      });
    }

    // always close the redirected window
    window.close();

    return <div />;
  }
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    web3Initialized: state.web3.initialized,
    web3Error: state.web3.error,
  }));
  const { address, isConnected } = useAccount();
  // const { chain } = useNetwork();

  useEffect(() => {
    const isCallback =
      queryCode !== undefined ||
      queryState !== undefined ||
      queryError !== undefined;
    if (address || !isCallback) {
      navigate(slugs.grants);
    }
  }, [address]);

  return (
    <div className="md:flex h-full">
      <div className="flex absolute top-0 left-10">
        <img
          className="py-4 mr-4"
          alt="Gitcoin Logo"
          src="./assets/gitcoin-logo.svg"
        />
        <img alt="Gitcoin Logo Text" src="./assets/gitcoin-logo-text.svg" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col absolute h-1/2 max-w-fit md:h-full justify-center container mx-10">
        <h3 className="mb-8 hidden md:inline-block">Grant Hub</h3>
        <h6 className="mb-4 pt-20 inline-block md:hidden">Grant Hub</h6>
        <h1 className="md:inline-block hidden">Bring your project to life</h1>
        <h4 className="md:hidden inline-block">Bring your project to life</h4>
        <p className="text-black text-xl">
          Build and fund your projects all in one place -- from creating a
          project to applying for grants to creating impact with your project
          starting today!
        </p>
        {/* A modal to prompt the user when landing and not on OP mainnet */}
        <CallbackModal
          modalOpen={false}
          toggleModal={() => true}
          confirmText="Switch to Optimism"
          confirmHandler={() => {
            console.log("SWITCH!!");
          }}
          headerImageUri="https://via.placeholder.com/380"
        >
          <>
            <h5 className="font-semibold mb-2 text-2xl">
              Switch to the Optimism network
            </h5>
            <p className="mb-4 ">
              Gitcoin Grant Hub is running on the Optimism network, a layer 2
              solution on Ethereum, which means transactions are cheaper and
              faster!
            </p>
          </>
        </CallbackModal>

        {!isConnected ? (
          <div className="mt-8">
            <ConnectButton />
            {props.web3Error !== undefined && (
              <div>
                <div>{props.web3Error}</div>
              </div>
            )}
          </div>
        ) : (
          <div>You Are Connected.. but something is wrong...</div>
        )}
      </div>
      <img
        className="absolute w-1/2 md:inline-block inset-y-56 right-0"
        src="./assets/landing-background.svg"
        alt="Jungle Background"
      />
      {/* <img
        className="h-1/2 w-full hidden"
        src="./assets/mobile-landing-background.svg"
        alt="Jungle Background"
      /> */}
    </div>
  );
}

export default Landing;
