import { VerifiableCredential } from "@gitcoinco/passport-sdk-types";
import { useEffect, useState } from "react";
import { ChangeHandlers } from "../types";
import Button, { ButtonVariants } from "./base/Button";
import { TextInput } from "./grants/inputs";
import Github from "./providers/Github";

const initialFormValues = {
  github: "",
  twitter: "",
};
export default function VerificationForm({
  setVerifying,
}: {
  setVerifying: (verifying: boolean) => void;
}) {
  const [formInputs, setFormInputs] = useState(initialFormValues);
  const [ghVerification, setGHVerification] = useState<
    VerifiableCredential | Error
  >();
  const handleInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, [e.target.name]: value });
  };

  useEffect(() => {
    console.log({ ghVerification });
  }, [ghVerification]);

  return (
    <div className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4">
      <div className="flex items-center">
        <img
          className="h-12 mr-12"
          src="./assets/gh_logo.png"
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
        />
      </div>
      <TextInput
        label="Project Name"
        name="twitter"
        placeholder="What's the project name?"
        value={formInputs.twitter}
        changeHandler={handleInput}
      />
      <div className="flex w-full justify-end mt-6">
        <Button
          variant={ButtonVariants.outline}
          onClick={() => setVerifying(false)}
        >
          Back
        </Button>
        <Button
          variant={ButtonVariants.primary}
          onClick={() => setVerifying(true)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
