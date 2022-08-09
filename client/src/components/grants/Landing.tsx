import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { RootState } from "../../reducers";
import { slugs } from "../../routes";
import CallbackModal from "../base/CallbackModal";
import WalletConnectionButton from "../base/WalletConnectButton";

function Landing() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    web3Initialized: state.web3.initialized,
    web3Error: state.web3.error,
    account: state.web3.account,
  }));
  // const [openConnectModal, setOpenConnectModal] = useState(false);
  const { address, isConnected } = useAccount();
  // const { data: ensName } = useEnsName({ address });
  // const { chain } = useNetwork();

  // const connectHandler = () => {
  //   // dispatch(initializeWeb3());
  //   if (isDisconnected) {
  //     console.log("Connecting your wallet now, please stand by ser ...");
  //     setOpenConnectModal(!openConnectModal);
  //   } else {
  //     console.log(`Your already connected with ${address}`);
  //   }
  // };

  useEffect(() => {
    if (address) {
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
      <div className="w-full md:w-1/2 flex flex-col h-1/2 max-w-fit md:h-full justify-center container mx-10">
        <h1 className="mb-8 hidden md:inline-block">Grant Hub</h1>
        <h3 className="mb-4 pt-20 inline-block md:hidden">Grant Hub</h3>
        <p>
          Manage projects that generate maximum impact and receive funds
          matching from Gitcoin, partner DAO, or independent grant program
          rounds.
        </p>
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
            <WalletConnectionButton />
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
