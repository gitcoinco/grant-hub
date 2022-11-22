// import { datadogRum } from "@datadog/browser-rum";
import { shallowEqual, useSelector } from "react-redux";
import { useState } from "react";
import { useSwitchNetwork } from "wagmi";
import { RootState } from "../../reducers";
import { ChangeHandlers, ProjectFormStatus } from "../../types";
import { Select } from "../grants/inputs";
import Button, { ButtonVariants } from "./Button";
import NetworkSwitchModal from "./NetworkSwitchModal";

function NetworkForm({
  setVerifying,
}: {
  setVerifying: (verifying: ProjectFormStatus) => void;
}) {
  const props = useSelector(
    (state: RootState) => ({
      currentChain: state.web3.chainID,
    }),
    shallowEqual
  );
  const [switchTo, setSwitchTo] = useState<number | undefined>(
    props.currentChain
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const { chains, switchNetworkAsync } = useSwitchNetwork();

  const handleNetworkSelect = (e: ChangeHandlers) => {
    setSwitchTo(parseInt(e.target.value, 10));
  };

  const nextStep = async () => {
    if (switchTo !== undefined) {
      if (props.currentChain !== switchTo) {
        if (!showModal) {
          setShowModal(true);
          return;
        }

        if (switchNetworkAsync) {
          await switchNetworkAsync(switchTo);
        }
      }

      setVerifying(ProjectFormStatus.Metadata);
      setShowModal(false);
    }
  };

  return (
    <div className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative mt-4 w-full sm:w-1/2">
          <div className="mb-2">
            Which network would you like to create this project on?
          </div>
          <Select
            name="network"
            defaultValue={props.currentChain}
            label={
              <span className="text-xs">
                For more details on network selection, read more.
              </span>
            }
            options={chains.map((i) => ({ id: i.id, title: i.name }))}
            changeHandler={handleNetworkSelect}
            required
          />
        </div>
        <div className="flex w-full justify-end mt-6">
          <Button
            disabled={false}
            variant={ButtonVariants.primary}
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      </form>
      <NetworkSwitchModal
        modalOpen={showModal}
        handleSwitch={nextStep}
        toggleModal={setShowModal}
        network={chains.find((i) => i.id === switchTo)?.name as string}
      />
    </div>
  );
}

export default NetworkForm;
