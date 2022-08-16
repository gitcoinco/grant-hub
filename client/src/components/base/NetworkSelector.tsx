import {
  Avatar,
  // Button,
  // Image,
  Menu,
  MenuButton,
  // MenuList,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
//! Couldn't get the damn chevron to display 🤬
// import { ChevronDownIcon } from "@heroicons/react/solid";
// import { useDispatch } from "react-redux";
import { useNetwork } from "wagmi";
// import { loadAccountData, web3ChainIDLoaded } from "../../actions/web3";
import { Button2 } from "./styles";

export default function NetworkSelector(): JSX.Element {
  // const dispatch = useDispatch();
  // const { address } = useAccount();
  const { chain } = useNetwork();
  // const {
  //   chains,
  //   error: networkError,
  //   isLoading,
  //   pendingChainId,
  //   switchNetwork,
  // } = useSwitchNetwork({
  //   onSuccess(data) {
  //     console.log("data", data);
  //     dispatch<any>(web3ChainIDLoaded(chain?.id!));
  //     dispatch<any>(loadAccountData(address!));
  //   },
  //   onError(error) {
  //     console.log("switch network error", error);
  //     dispatch({ type: "WEB3_ERROR", error });
  //   },
  // });

  // todo: set this based on round and current chain
  const colorScheme: string = "white";

  return (
    <div className="p-2 m-2 mb-2">
      <Menu>
        <MenuButton as={Button2}>
          <div className="">
            <Tag size="lg" colorScheme={colorScheme} borderRadius="full">
              {(chain?.id === 69 || chain?.id === 10) && (
                <Avatar
                  src="./assets/optimism-logo.png"
                  size="xs"
                  name="Optimism"
                  ml={-1}
                  mr={4}
                />
              )}
              <TagLabel>{chain?.name}</TagLabel>
            </Tag>
          </div>
        </MenuButton>
        {/* <MenuList>
          {chains
            .filter((c) => c.id !== chain?.id)
            .map((x) => (
              <Button
                type="button"
                className="inline-flex justify-center w-full sm:text-sm mt-4"
                disabled={!switchNetwork}
                key={x.id}
                onClick={() => switchNetwork?.(x.id)}
              >
                {x.name}
                {isLoading && pendingChainId === x.id && " (switching)"}
              </Button>
            ))}
          {networkError?.message && (
            <div className="text-sm text-red-600 my-4">
              {networkError.message}
            </div>
          )}
        </MenuList> */}
      </Menu>
    </div>
  );
}
