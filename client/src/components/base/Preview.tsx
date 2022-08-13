import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNetwork, useSigner } from "wagmi";
import { publishGrant } from "../../actions/newGrant";
import { Status } from "../../reducers/newGrant";
import { slugs } from "../../routes";
import { FormInputs, ProjectFormStatus } from "../../types";
import { formatDate } from "../../utils/components";
import Details from "../grants/Details";
import Button, { ButtonVariants } from "./Button";
import Toast from "./Toast";
import TXLoading from "./TXLoading";

export default function Preview({
  currentProjectId,
  setVerifying,
  formInputs,
}: {
  currentProjectId?: string;
  setVerifying: (verifying: ProjectFormStatus) => void;
  formInputs: FormInputs;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [show, showToast] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { chain } = useNetwork();

  const [status, setStatus] = useState<Status>(Status.Undefined);

  const { data: signer } = useSigner();

  const publishProject = async () => {
    if (!chain || !signer) {
      console.error("Missing chain or signer");
      return;
    }
    setSubmitted(true);
    showToast(true);
    await publishGrant(formInputs, chain!.id, signer, currentProjectId)
      .then(() => {
        setStatus(Status.Completed);
      })
      .catch((e) => {
        setStatus(Status.Error);
        setError(e.message);
      });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (status === Status.Completed) {
      setTimeout(() => navigate(slugs.grants), 1500);
    }
  }, [status]);

  return (
    <div>
      <Details
        preview
        updatedAt={formatDate(Date.now() / 1000)}
        project={formInputs}
        logoImg={formInputs.logoImg ?? "./icons/lightning.svg"}
        bannerImg={formInputs.bannerImg ?? "./assets/card-img.png"}
      />
      <div className="flex justify-end">
        <Button
          variant={ButtonVariants.outline}
          onClick={() => setVerifying(ProjectFormStatus.Verification)}
        >
          Back to Editing
        </Button>
        <Button
          disabled={submitted}
          variant={ButtonVariants.primary}
          onClick={publishProject}
        >
          Save and Publish
        </Button>
      </div>
      <Toast
        show={show}
        fadeOut={status === Status.Completed}
        onClose={() => showToast(false)}
        error={status === Status.Error}
      >
        <TXLoading status={status} error={error} />
      </Toast>
    </div>
  );
}
