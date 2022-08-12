import {
  Button,
  // Image,
  Menu,
  MenuButton,
  // MenuItem,
  MenuList,
  Tag,
  TagLabel,
  Avatar,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useDispatch } from "react-redux";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { loadProjects } from "../../actions/projects";
import { loadAccountData, web3ChainIDLoaded } from "../../actions/web3";
import { Button2 } from "./styles";

export default function NetworkSelector(): JSX.Element {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const {
    chains,
    error: networkError,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork({
    onSuccess(data) {
      dispatch<any>(web3ChainIDLoaded(data?.id));
      dispatch<any>(loadAccountData(address!));
      dispatch<any>(loadProjects(address!, signer, chain?.id!));
    },
    onError(error) {
      console.log("switch network error", error);
      dispatch({ type: "WEB3_ERROR", error });
    },
  });

  // todo: update when we get the chainId in the uri JR
  const colorScheme: string = "white";

  return (
    <div className="p-2 m-2 mb-2">
      <Menu>
        <MenuButton as={Button2} rightIcon={<ChevronDownIcon />}>
          <div className="">
            <Tag size="lg" colorScheme={colorScheme} borderRadius="full">
              {chain?.id === 69 && (
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
        <MenuList>
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
        </MenuList>
      </Menu>
    </div>
  );
}
