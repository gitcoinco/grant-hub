import { VerifiableCredential } from "@gitcoinco/passport-sdk-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { credentialsSaved } from "../../actions/projectForm";
import { ChangeHandlers, ProjectFormStatus } from "../../types";
import Button, { ButtonVariants } from "./Button";
import { TextInput } from "../grants/inputs";
import Github from "../providers/Github";
import Twitter from "../providers/Twitter";

const initialFormValues = {
  github: "",
  twitter: "",
};

export default function VerificationForm({
  setVerifying,
}: {
  setVerifying: (verifying: ProjectFormStatus) => void;
}) {
  const dispatch = useDispatch();

  const [formInputs, setFormInputs] = useState(initialFormValues);
  const [ghVerification, setGHVerification] = useState<VerifiableCredential>();
  const [twitterVerification, setTwitterVerification] =
    useState<VerifiableCredential>();
  const [error, setError] = useState<string | undefined>();
  const handleInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, [e.target.name]: value });
  };

  const saveAndPreview = () => {
    dispatch(
      credentialsSaved({
        github: {
          input: formInputs.github,
          credential: ghVerification,
        },
        twitter: {
          input: formInputs.twitter,
          credential: twitterVerification,
        },
      })
    );
    setVerifying(ProjectFormStatus.Preview);
  };

  return (
    <div className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4">
      <div className="flex items-center">
        <img
          className="h-12 mr-12"
          src="./assets/github_logo.png"
          alt="Github Logo"
        />
        <TextInput
          label="Project Name"
          info="Connect your project’s GitHub account to verify (Optional)"
          name="github"
          placeholder="What's the project name?"
          value={formInputs.github}
          changeHandler={handleInput}
        />
        <Github
          org={formInputs.github}
          verificationComplete={setGHVerification}
          verificationError={(providerError) => setError(providerError)}
        />
      </div>
      <hr className="my-4" />
      <div className="flex items-center">
        <img
          className="h-12 mr-9"
          src="./assets/twitter_logo.svg"
          alt="Twitter Logo"
        />
        <TextInput
          label="Project Name"
          info="Connect your project’s Twitter account to verify (Optional)"
          name="twitter"
          placeholder="What's the project name?"
          value={formInputs.twitter}
          changeHandler={handleInput}
        />
        <Twitter
          handle={formInputs.twitter}
          verificationComplete={setTwitterVerification}
          verificationError={(providerError) => setError(providerError)}
        />
      </div>
      <hr className="my-4" />
      {error && (
        <div className="flex bg-danger-background/25 p-4 rounded">
          <img
            className="h-4 mt-1 mx-2"
            src="./icons/x-circle.svg"
            alt="error icon"
          />
          <p className="text-danger-text font-normal">{error}</p>
        </div>
      )}
      <div className="flex w-full justify-end mt-6">
        <Button
          variant={ButtonVariants.outline}
          onClick={() => setVerifying(ProjectFormStatus.Metadata)}
        >
          Back
        </Button>
        <Button variant={ButtonVariants.primary} onClick={saveAndPreview}>
          Next
        </Button>
      </div>
    </div>
  );
}
