import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ValidationError } from "yup";
import { submitApplication } from "../../actions/roundApplication";
import { RootState } from "../../reducers";
import {
  ChangeHandlers,
  DynamicFormInputs,
  Metadata,
  ProjectOption,
  Round,
  RoundApplicationMetadata,
} from "../../types";
import { isValidAddress } from "../../utils/wallet";
import Button, { ButtonVariants } from "../base/Button";
import { validateApplication } from "../base/formValidation";
import {
  Select,
  TextArea,
  TextInput,
  TextInputAddress,
} from "../grants/inputs";
import Radio from "../grants/Radio";
import Toggle from "../grants/Toggle";

const validation = {
  messages: [""],
  valid: false,
  errorCount: 0,
};

export default function Form({
  roundApplication,
  round,
}: {
  roundApplication: RoundApplicationMetadata;
  round: Round;
}) {
  const dispatch = useDispatch();

  const [formInputs, setFormInputs] = useState<DynamicFormInputs>({});
  const [preview, setPreview] = useState(false);
  const [formValidation, setFormValidation] = useState(validation);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>();
  const [showProjectDetails] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState<
    string | undefined
  >(undefined);

  const props = useSelector((state: RootState) => {
    const allProjectMetadata = state.grantsMetadata;
    let selectedProjectMetadata: Metadata | undefined;
    if (selectedProjectID !== undefined && selectedProjectID !== "") {
      selectedProjectMetadata =
        allProjectMetadata[Number(selectedProjectID)]?.metadata;
    }

    return {
      projects: state.projects.projects,
      allProjectMetadata,
      selectedProjectMetadata,
    };
  }, shallowEqual);

  const schema = roundApplication.applicationSchema;

  const handleInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, [e.target.name]: value });
  };

  const handleProjectInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setSelectedProjectID(value);
    handleInput(e);
  };

  const handleInputAddress = async (e: ChangeHandlers) => {
    const { value } = e.target;
    const isValid = isValidAddress(value);
    if (!isValid) {
      setFormValidation({
        messages: ["Please enter a valid address"],
        valid: false,
        errorCount: 1,
      });
      setDisableSubmit(true);
    } else {
      setFormValidation(validation);
    }

    handleInput(e);
  };

  const handleRadioInput = async (e: ChangeHandlers) => {
    handleInput(e);
  };

  const validate = async () => {
    try {
      await validateApplication(schema, formInputs);
      setFormValidation({
        messages: [],
        valid: true,
        errorCount: 0,
      });
      setDisableSubmit(false);
    } catch (e) {
      const error = e as ValidationError;
      console.log(error);
      setFormValidation({
        messages: error.inner.map((er) => (er as ValidationError).message),
        valid: false,
        errorCount: error.inner.length,
      });
      setDisableSubmit(true);
    }
  };

  const handlePreviewClick = async () => {
    await validate();
    setPreview(true);
  };

  const handleSubmitApplication = async () => {
    if (formValidation.valid) {
      dispatch(submitApplication(round.address, formInputs));
    }
  };

  useEffect(() => {
    setFormValidation({ ...validation, valid: true });
    const currentOptions = props.projects.map(
      (project): ProjectOption => ({
        id: project.id,
        title: props.allProjectMetadata[project.id].metadata?.title,
      })
    );
    currentOptions.unshift({ id: undefined, title: "" });

    setProjectOptions(currentOptions);
  }, [props.allProjectMetadata]);

  // todo: need a way to determine if each individual input is valid or not

  return (
    <div className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        {schema.map((input) => {
          switch (input.type) {
            case "PROJECT":
              return (
                <>
                  <Select
                    key={input.id}
                    name={`${input.id}`}
                    label={input.question}
                    options={projectOptions ?? []}
                    disabled={preview}
                    changeHandler={handleProjectInput}
                    required={input.required ?? true}
                    isValid={formValidation.valid}
                  />
                  <Toggle
                    projectMetadata={props.selectedProjectMetadata}
                    showProjectDetails={showProjectDetails}
                  />
                  <p className="text-xs mt-4 mb-1">
                    To complete your application to {round.roundMetadata.name},
                    a little more info is needed:
                  </p>
                  <hr className="w-1/2" />
                </>
              );
            case "TEXT":
              return (
                <TextInput
                  key={input.id}
                  label={input.question}
                  placeholder={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
                  required={input.required ?? false}
                  isValid={formValidation.valid}
                />
              );
            case "RECIPIENT":
              /* Radio for safe or multi-sig */
              return (
                <>
                  <div className="relative mt-2">
                    <Stack>
                      <Radio
                        label="Is your payout wallet a Gnosis Safe or multi-sig?"
                        choices={["Yes", "No"]}
                        changeHandler={handleRadioInput}
                        name="isSafe"
                        value={formInputs.isSafe}
                        info=""
                        required={input.required ?? true}
                        disabled={preview}
                        isValid={formValidation.valid}
                      />
                    </Stack>
                  </div>
                  <TextInputAddress
                    key={input.id}
                    label={input.question ?? "Payout Wallet Address"}
                    placeholder={input.info}
                    name={`${input.id}`}
                    tooltipValue="Please make sure the payout address you provide is a valid address that you own on the Optimism network.
          If you provide the address for a gnosis SAFE or other multisig, please confirm the multisig is deployed to Optimism,
          and not simply a multisig you own on L1. Optimism will send a test transaction and require you send it back before
          sending the balance of any full grant."
                    value={formInputs[`${input.id}`]}
                    disabled={preview}
                    changeHandler={handleInputAddress}
                    required={input.required ?? true}
                    isValid={formValidation.valid}
                  />
                </>
              );
            case "TEXTAREA":
              return (
                <TextArea
                  key={input.id}
                  label={input.question}
                  placeholder={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
                  required={input.required ?? false}
                  isValid={formValidation.valid}
                />
              );
            case "RADIO":
              return (
                <Radio
                  key={input.id}
                  label={input.question}
                  name={`${input.id}`}
                  value={
                    formInputs[`${input.id}`] ??
                    (input.choices && input.choices[0])
                  }
                  choices={input.choices}
                  disabled={preview}
                  changeHandler={handleInput}
                  required={input.required ?? false}
                  isValid={formValidation.valid}
                />
              );
            // case "MULTIPLE":
            // placeholder until we support multiple input
            //   return (
            //     <Radio
            //       label={appInput.question}
            //       name={id}
            //       info={appInput.info}
            //       choices={appInput.choices}
            //       changeHandler={(e) => console.log(e)}
            //     />
            //   );
            default:
              return (
                <TextInput
                  key={input.id}
                  label={input.question}
                  placeholder={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`]}
                  disabled={preview}
                  changeHandler={handleInput}
                  required={input.required ?? false}
                  isValid={formValidation.valid}
                />
              );
          }
        })}
        {!formValidation.valid && preview ? (
          <div
            className="p-4 text-gitcoin-pink-500 border rounded border-red-900/10 bg-gitcoin-pink-100 mt-8"
            role="alert"
          >
            <strong className="text-sm font-medium">
              There {formValidation.errorCount === 1 ? "was" : "were"}{" "}
              {formValidation.errorCount}{" "}
              {formValidation.errorCount === 1 ? "error" : "errors"} with your
              form submission
            </strong>

            <ul className="mt-1 ml-2 text-xs list-disc list-inside">
              {formValidation.messages.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        ) : (
          formInputs.isSafe === "Yes" && (
            <div
              className="p-4 border rounded border-yellow-900/10 bg-gitcoin-yellow mt-8"
              role="alert"
            >
              <strong className="text-sm text-gitcoin-gold font-medium">
                Make sure your Gnosis Safe or multi-sig wallet is deployed on
                Optimism
              </strong>
              <ol>
                <li className="mt-1 ml-4 text-black text-sm list-disc list-inside">
                  Looks like the payout wallet address you entered may not be a
                  Gnosis Safe or multi-sig that has been deployed on Optimism.
                  Make sure your Gnosis Safe or multi-sig wallet is deployed on
                  Optimism before proceeding.
                </li>
              </ol>
            </div>
          )
        )}
        <div className="flex justify-end">
          {!preview ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={() => handlePreviewClick()}
            >
              Preview Application
            </Button>
          ) : (
            <div className="flex justify-end">
              <Button
                variant={ButtonVariants.outline}
                onClick={() => {
                  setPreview(false);
                  setFormValidation({
                    valid: true,
                    messages: [],
                    errorCount: 0,
                  });
                }}
              >
                Back to Editing
              </Button>
              <Button
                variant={ButtonVariants.primary}
                onClick={handleSubmitApplication}
                disabled={disableSubmit}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
