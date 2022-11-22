// import colors from "../../styles/colors";
import { BaseModal } from "./BaseModal";
import Button, { ButtonVariants } from "./Button";

interface NetworkSwitchModalProps {
  modalOpen: boolean;
  network?: string;
  toggleModal: (status: boolean) => void;
  handleSwitch: () => void;
}

export default function NetworkSwitchModal({
  modalOpen,
  network,
  toggleModal,
  handleSwitch,
}: NetworkSwitchModalProps) {
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
            <h5 className="font-semibold mb-2">Switch Network to Continue</h5>
            <p className="mb-6">
              To create a project on {network}, you need to switch the network
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
          <Button onClick={handleSwitch} variant={ButtonVariants.primary}>
            <span className="inline-flex flex-1 justify-center items-center">
              Switch Network
            </span>
          </Button>
        </div>
      </section>
    </BaseModal>
  );
}
