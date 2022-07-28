import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../reducers";
import { slugs } from "../../routes";
import { BaseModal } from "../base/BaseModal";
import Button, { ButtonVariants } from "../base/Button";
import WalletOptions from "../base/WalletOptions";
import { useAccount } from "wagmi";

function Landing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    web3Initialized: state.web3.initialized,
    web3Error: state.web3.error,
    account: state.web3.account,
  }));
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  const connectHandler = () => {
    // dispatch(initializeWeb3());
    if (isDisconnected) {
      setOpenConnectModal(!openConnectModal);
    }
    if (isConnecting) {
      console.log("Connecting your wallet now, please wait...");
    }
    console.log(`Your already connected with ${address}`);
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
        {!props.web3Initialized && (
          <div className="mt-8">
            <Button
              onClick={() => connectHandler()}
              variant={ButtonVariants.primary}
              styles={["w-full sm:w-auto mx-w-full ml-0"]}
            >
              Connect Wallet
            </Button>
            {props.web3Error !== undefined && (
              <div>
                <div>{props.web3Error}</div>
              </div>
            )}
          </div>
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
      <BaseModal
        isOpen={openConnectModal}
        onClose={() => {
          setOpenConnectModal(!openConnectModal);
        }}
        children={<WalletOptions />}
        title="Connect Wallet"
        footer={<></>}
      />
    </div>
  );
}

export default Landing;
