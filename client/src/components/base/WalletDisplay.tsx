import {
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
//! I couldn't get this damn chevron to display 🤬
// import { ChevronDownIcon } from "@heroicons/react/solid";
import { useDispatch } from "react-redux";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { shortAddress } from "../../utils/wallet";
import { Button } from "./styles";

export default function WalletDisplay(): JSX.Element {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  // const { data: signer } = useSigner();
  // const { chain } = useNetwork();
  // const {
  //   chains,
  //   error: networkError,
  //   isLoading,
  //   pendingChainId,
  //   switchNetwork,
  // } = useSwitchNetwork({
  //   onSuccess(data) {
  //     setOpen(false);
  //     dispatch({ type: "WEB3_CHAIN_ID_LOADED", chainID: data?.id }));
  //     dispatch<any>(loadAccountData(address!));
  //     dispatch<any>(loadProjects(address!, signer, chain?.id!));
  //   },
  //   onError(error) {
  //     console.log("switch network error", error);
  //     dispatch({ type: "WEB3_ERROR", error });
  //   },
  // });
  const { disconnect } = useDisconnect({
    onSuccess() {
      dispatch({
        type: "WEB3_ACCOUNT_DISCONNECTED",
        account: undefined,
      });
    },
    onError(error) {
      console.log("disconnect error", error);
      dispatch({ type: "WEB3_ERROR", error });
    },
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
    onSuccess() {
      dispatch({ type: "ENS_NAME_LOADED", ens: ensName });
      console.log("ensName", ensName);
    },
    onError(error) {
      console.log("ens error", error);
      dispatch({ type: "WEB3_ERROR", error });
    },
  });

  function isValidAddress(): boolean {
    return address !== "0x0000000000000000000000000000000000000000";
  }

  // 🤔 could use also as a signal that user is on the right network
  const avatarBg = isConnected ? "green.500" : "red.500";

  return (
    <div className="p-2 m-2 mb-2 mt-3">
      <Menu>
        <MenuButton as={Button}>
          <Avatar size="xs">
            <AvatarBadge boxSize="1.25em" bg={avatarBg} />
          </Avatar>{" "}
          {ensName ?? isValidAddress()
            ? shortAddress(address!)
            : "Connect Wallet"}
        </MenuButton>
        <MenuList>
          {/* <MenuItem minH="48px" onClick={() => setOpen(true)}>
            <span>Switch Network</span>
          </MenuItem> */}
          <MenuItem minH="40px" onClick={() => disconnect()}>
            <span>Disconnect</span>
          </MenuItem>
        </MenuList>
      </Menu>
      {/* todo: redo this modal using our base setup 
      <BaseModal isOpen={open} onClose={() => {}} /> */}
    </div>
  );
}
