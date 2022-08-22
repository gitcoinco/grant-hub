import { useState } from "react";
import toast from "react-hot-toast/headless";
import { useNavigate } from "react-router-dom";
import { useNetwork, useSigner } from "wagmi";
import { publishGrant } from "../../actions/newGrant";
import { slugs } from "../../routes";
import { FormInputs, ProjectFormStatus } from "../../types";
import { formatDate } from "../../utils/components";
import Details from "../grants/Details";
import Button, { ButtonVariants } from "./Button";

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

  const { chain } = useNetwork();

  const { data: signer } = useSigner();

  const navigate = useNavigate();

  const publishProject = async () => {
    if (!chain || !signer) {
      console.error("Missing chain or signer");
      return;
    }
    setSubmitted(true);
    const promise = publishGrant(
      formInputs,
      chain!.id,
      signer,
      currentProjectId
    );

    try {
      toast.promise(
        promise.then(() => setTimeout(() => navigate(slugs.grants), 1500)),
        {
          loading: (
            <div>
              <p className="font-semibold text-quaternary-text">
                Creating Grant
              </p>
              <p className="text-quaternary-text">
                Your grant is being created...
              </p>
            </div>
          ),
          success: (
            <div>
              <p className="font-semibold text-quaternary-text">
                Grant created
              </p>
              <p className="text-quaternary-text">
                Your grant was successfully created!
              </p>
            </div>
          ),
          // TODO @DanieleSalatti: record metric in error case
          // eslint-disable-next-line react/no-unstable-nested-components
          error: (e) => (
            <div>
              <p className="font-semibold text-quaternary-text">Error</p>
              <p className="text-quaternary-text">
                There was an error creating your grant: {e.message}
              </p>
            </div>
          ),
        }
      );
    } catch (e: any) {
      toast.error(
        <div>
          <p className="font-semibold text-quaternary-text">Error</p>
          <p className="text-quaternary-text">
            There was an error creating your grant: {e.message}
          </p>
        </div>
      );
    }
  };

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
    </div>
  );
}
