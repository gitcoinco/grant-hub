import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ValidationError } from "yup";
import loadProjects from "../../actions/projects";
import submitApplication from "../../actions/roundApplication";
import { useClients } from "../../hooks/useDataClient";
import { Status } from "../../reducers/newGrant";
import {
  ChangeHandlers,
  ProjectOption,
  Round,
  RoundApplicationMetadata,
  RoundApplicationQuestion,
} from "../../types";
import Button, { ButtonVariants } from "../base/Button";
import { validateApplication } from "../base/formValidation";
import TextLoading from "../base/TextLoading";
import Toast from "../base/Toast";
import TXLoading from "../base/TXLoading";
import { Select, TextArea, TextInput } from "../grants/inputs";
import Radio from "../grants/Radio";

interface DynamicFormInputs {
  [key: string]: string;
}

const validation = {
  message: "",
  valid: false,
};

export default function Form({
  roundApplication,
  round,
}: {
  roundApplication: RoundApplicationMetadata;
  round: Round;
}) {
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const { grantHubClient, roundManagerClient } = useClients();

  const [formInputs, setFormInputs] = useState<DynamicFormInputs>({});
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formValidation, setFormValidation] = useState(validation);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>();
  const [status, setStatus] = useState<Status>(Status.Undefined);
  const [show, showToast] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [schema, setSchema] = useState<RoundApplicationQuestion[]>([]);

  const handleInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, [e.target.name]: value });
  };

  const validate = async () => {
    try {
      await validateApplication(schema, formInputs);
      setFormValidation({
        message: "",
        valid: true,
      });
    } catch (e) {
      const err = e as ValidationError;
      setFormValidation({
        message: err.message,
        valid: false,
      });
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitted(true);
    await validate();
    if (roundManagerClient && formValidation.valid) {
      showToast(true);
      await submitApplication(roundManagerClient, round.address, formInputs)
        .then(() => {
          console.log("Application submitted");
          // TODO @DanieleSalatti: toast is grant creation specific - fix
          setStatus(Status.Completed);
        })
        .catch((e) => {
          setStatus(Status.Error);
          setError(e.message);
        });
    }
  };

  // perform validation after the fields state is updated
  useEffect(() => {
    validate();
  }, [formInputs]);

  async function fetchAllProjects() {
    if (!grantHubClient) return;

    const allProjects = await loadProjects(grantHubClient, address!, true);

    const currentOptions = allProjects.map(
      (project): ProjectOption => ({
        id: Number(project.id),
        title: project.metadata?.title,
      })
    );
    currentOptions.unshift({ id: undefined, title: "" });

    setProjectOptions(currentOptions);

    const projectQuestion: RoundApplicationQuestion = {
      id: roundApplication.applicationSchema.length,
      question: "Select a project you would like to apply for funding:",
      type: "PROJECT", // this will be a limited set [TEXT, TEXTAREA, RADIO, MULTIPLE]
      required: true,
      info: "",
      choices: currentOptions?.map((option) => option.title!),
    };

    setSchema([projectQuestion, ...roundApplication.applicationSchema]);

    setLoading(false);
  }

  useEffect(() => {
    fetchAllProjects();
  }, [grantHubClient]);

  return loading ? (
    <TextLoading />
  ) : (
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
                    changeHandler={handleInput}
                  />
                  <p className="text-xs mt-4 mb-1">
                    To complete your application to {round.roundMetadata.name},
                    a little more info is needed:
                  </p>
                  <hr />
                </>
              );
            case "TEXT":
            case "RECIPIENT": // FIXME: separate RECIPIENT to have address validation
              return (
                <TextInput
                  key={input.id}
                  label={input.question}
                  info={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
                />
              );
            case "TEXTAREA":
              return (
                <TextArea
                  key={input.id}
                  label={input.question}
                  info={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
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
                  info={input.info}
                  choices={input.choices}
                  disabled={preview}
                  changeHandler={handleInput}
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
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
                />
              );
          }
        })}
        {!formValidation.valid && submitted && (
          <p className="text-danger-text w-full text-center font-semibold my-2">
            {formValidation.message}
          </p>
        )}
        <div className="flex justify-end">
          {!preview ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={() => setPreview(true)}
            >
              Preview Application
            </Button>
          ) : (
            <div className="flex justify-end">
              <Button
                variant={ButtonVariants.outline}
                onClick={() => setPreview(false)}
              >
                Back to Editing
              </Button>
              <Button
                variant={ButtonVariants.primary}
                onClick={handleSubmitApplication}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </form>
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
