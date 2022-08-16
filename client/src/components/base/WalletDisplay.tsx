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
import { shortAddress, isValidAddress } from "../../utils/wallet";
import { Button } from "./styles";

export default function WalletDisplay(): JSX.Element {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess() {
      dispatch({
        type: "WEB3_ACCOUNT_DISCONNECTED",
        account: undefined,
      });
    },
    onError(error) {
      dispatch({ type: "WEB3_ERROR", error });
    },
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
    onSuccess() {
      dispatch({ type: "ENS_NAME_LOADED", ens: ensName });
    },
    onError(error) {
      dispatch({ type: "WEB3_ERROR", error });
    },
  });

  // 🤔 could use also as a signal that user is on the right network
  const avatarBg = isConnected ? "green.500" : "red.500";

  return (
    <div className="p-2 m-2 mb-2 mt-3">
      <Menu>
        <MenuButton as={Button}>
          <Avatar size="xs">
            <AvatarBadge boxSize="1.25em" bg={avatarBg} />
          </Avatar>{" "}
          {ensName ?? isValidAddress(address!)
            ? shortAddress(address!)
            : "Connect Wallet"}
        </MenuButton>
        <MenuList>
          <MenuItem minH="40px" onClick={() => disconnect()}>
            <span>Disconnect</span>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
