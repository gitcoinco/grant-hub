import { useState } from "react";
import colors from "../../styles/colors";
import { FormInputs, ProjectFormStatus } from "../../types";
import Button, { ButtonVariants } from "../base/Button";
import ExitModal from "../base/ExitModal";
import Preview from "../base/Preview";
import ProjectForm from "../base/ProjectForm";
import VerificationForm from "../base/VerificationForm";
import Cross from "../icons/Cross";

function NewProject() {
  const [modalOpen, toggleModal] = useState(false);
  const [formStatus, setFormStatus] = useState<ProjectFormStatus>(
    ProjectFormStatus.Metadata
  );
  const [formInputs, setFormInputs] = useState<FormInputs | null>(null);

  const currentForm = (status: ProjectFormStatus) => {
    switch (status) {
      case ProjectFormStatus.Metadata:
        return (
          <ProjectForm
            setVerifying={(verifyUpdate) => setFormStatus(verifyUpdate)}
            setFormInputs={setFormInputs}
            formInputs={formInputs}
          />
        );
      case ProjectFormStatus.Verification:
        return (
          <VerificationForm
            setVerifying={(verifyUpdate) => setFormStatus(verifyUpdate)}
            setFormInputs={setFormInputs}
            formInputs={formInputs}
          />
        );
      case ProjectFormStatus.Preview:
        return (
          <Preview
            setVerifying={(verifyUpdate) => setFormStatus(verifyUpdate)}
            formInputs={formInputs!}
          />
        );
      default:
        return (
          <ProjectForm
            setVerifying={(verifyUpdate) => setFormStatus(verifyUpdate)}
            setFormInputs={setFormInputs}
            formInputs={formInputs}
          />
        );
    }
  };

  return (
    <div className="mx-4">
      <div className="flex flex-col sm:flex-row justify-between">
        <h3 className="mb-2">Create Project</h3>
        <div className="w-full mb-2 inline-block sm:hidden">
          <p>Tell us what you’re working on.</p>
        </div>
        <Button
          variant={ButtonVariants.outlineDanger}
          onClick={() => toggleModal(true)}
          styles={["w-full sm:w-auto mx-w-full ml-0"]}
        >
          <i className="mt-1.5">
            <Cross color={colors["danger-background"]} />
          </i>
          <span className="pl-2">Exit</span>
        </Button>
      </div>

      <div className="w-full flex">
        <div className="w-full md:w-1/3 mb-2 hidden sm:inline-block">
          <p>Tell us what you’re working on.</p>
        </div>
        <div className="w-full md:w-2/3">{currentForm(formStatus)}</div>
      </div>
      <ExitModal modalOpen={modalOpen} toggleModal={toggleModal} />
    </div>
  );
}

export default NewProject;
