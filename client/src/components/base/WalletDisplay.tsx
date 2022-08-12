import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
// import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
// import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
// import { loadProjects } from "../../actions/projects";
// import { loadAccountData, web3ChainIDLoaded } from "../../actions/web3";
import { shortAddress } from "../../utils/wallet";
// import { BaseModal } from "./BaseModal";
import { Button } from "./styles";

export default function WalletDisplay(): JSX.Element {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { address } = useAccount();
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
  //     dispatch<any>(web3ChainIDLoaded(data?.id));
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

  return (
    <div className="p-2 m-2 mb-2 mt-3">
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon className="text-black" />}
        >
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
      {/* <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed z-10 inset-0">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all">
                  <div className="hidden sm:block absolute top-0 right-0 py-4 pr-4">
                    <button
                      type="button"
                      className="text-grey-300 hover:text-grey-400 absolute top-0 right-0 py-4 pr-4"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-4">
                    {chains.map((x) => (
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root> */}
    </div>
  );
}
