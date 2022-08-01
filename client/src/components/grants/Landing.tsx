import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAccount, useEnsName, useNetwork } from "wagmi";
import { RootState } from "../../reducers";
import { slugs } from "../../routes";
import WalletConnectionButton from "../base/WalletConnectButton";

function Landing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    web3Initialized: state.web3.initialized,
    web3Error: state.web3.error,
    account: state.web3.account,
  }));
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { address, isConnecting, isConnected, isDisconnected, status } =
    useAccount();
  const { data: ensName } = useEnsName({ address });
  const { chain } = useNetwork();

  const connectHandler = () => {
    // dispatch(initializeWeb3());
    if (isDisconnected) {
      console.log("Connecting your wallet now, please stand by ser ...");
      setOpenConnectModal(!openConnectModal);
    } else {
      console.log(`Your already connected with ${address}`);
    }
  };

  useEffect(() => {
    if (props.account) {
      navigate(slugs.grants);
    }
  }, [props.account]);

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
      <div className="w-full md:w-1/2 flex flex-col h-1/2 max-w-fit md:h-full justify-center container mx-10">
        <h1 className="mb-8 hidden md:inline-block">Grant Hub</h1>
        <h3 className="mb-4 pt-20 inline-block md:hidden">Grant Hub</h3>
        <p>
          Manage projects that generate maximum impact and receive funds
          matching from Gitcoin, partner DAO, or independent grant program
          rounds.
        </p>
        {!isConnecting ? (
          <div className="mt-8">
            <WalletConnectionButton />
            {props.web3Error !== undefined && (
              <div>
                <div>{props.web3Error}</div>
              </div>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <img
        className="w-1/2 hidden md:inline-block"
        src="./assets/landing-background.svg"
        alt="Jungle Background"
      />
      <img
        className="h-1/2 w-full inline-block md:hidden"
        src="./assets/mobile-landing-background.svg"
        alt="Jungle Background"
      />
      {/* <BaseModal
        isOpen={openConnectModal}
        onClose={() => {
          setOpenConnectModal(!openConnectModal);
        }}
        children={
          <WalletOptions address={address} isDisconnected={isDisconnected} />
        }
        title="Connect Wallet"
        footer={<></>}
      /> */}
    </div>
  );
}

export default Landing;
