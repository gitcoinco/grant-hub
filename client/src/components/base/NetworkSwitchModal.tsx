// import colors from "../../styles/colors";
import { useSwitchNetwork } from "wagmi";
import { BaseModal } from "./BaseModal";
import Button, { ButtonVariants } from "./Button";

interface NetworkSwitchModalProps {
  modalOpen: boolean;
  networkId?: number;
  networkName?: string;
  toggleModal: (status: boolean) => void;
  onSwitch?: (networkId?: number) => void;
}

export default function NetworkSwitchModal({
  modalOpen,
  networkId,
  networkName,
  toggleModal,
  onSwitch,
}: NetworkSwitchModalProps) {
  const { switchNetworkAsync } = useSwitchNetwork();

  const handleNetworkSwitch = async () => {
    if (switchNetworkAsync) {
      await switchNetworkAsync(networkId);
      if (onSwitch) {
        onSwitch(networkId);
      }
    }
  };

  return (
    <BaseModal
      isOpen={modalOpen}
      size="md"
      onClose={() => toggleModal(false)}
      hideCloseButton
    >
      <section className="w-full">
        <div className="flex">
          <div className="w-full text-center">
            <h5 className="font-semibold mb-2">Switch Networks to Continue</h5>
            <p className="mb-6">
              To create a project on {networkName}, you need to switch networks
              on your wallet.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={ButtonVariants.outline}
            onClick={() => toggleModal(false)}
          >
            <span className="inline-flex flex-1 justify-center items-center">
              Cancel
            </span>
          </Button>
          <Button
            onClick={handleNetworkSwitch}
            variant={ButtonVariants.primary}
          >
            <span className="inline-flex flex-1 justify-center items-center">
              Switch Network
            </span>
          </Button>
        </div>
      </section>
    </BaseModal>
  );
}
