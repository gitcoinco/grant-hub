import { useEffect, useState } from "react";
import { ValidationError } from "yup";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
} from "@chakra-ui/react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  ChangeHandlers,
  RoundApplicationMetadata,
  ProjectOption,
  Round,
} from "../../types";
import { Select, TextArea, TextInput } from "../grants/inputs";
import { validateApplication } from "../base/formValidation";
import Radio from "../grants/Radio";
import Button, { ButtonVariants } from "../base/Button";
import { RootState } from "../../reducers";
import { loadProjects } from "../../actions/projects";
import { submitApplication } from "../../actions/roundApplication";
import ProjectDetails from "./ProjectDetails";
// import ProjectDetails from "./ProjectDetails";

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
  const dispatch = useDispatch();

  const props = useSelector(
    (state: RootState) => ({
      projects: state.projects.projects,
      allProjectMetadata: state.grantsMetadata,
    }),
    shallowEqual
  );

  const [formInputs, setFormInputs] = useState<DynamicFormInputs>({});
  const [, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formValidation, setFormValidation] = useState(validation);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>();
  const [showProjectDetails, setShowProjectDetails] = useState(true);

  const schema = roundApplication.applicationSchema;

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
      const error = e as ValidationError;
      setFormValidation({
        message: error.message,
        valid: false,
      });
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitted(true);
    await validate();
    if (formValidation.valid) {
      dispatch(submitApplication(round.address, formInputs));
    }
  };

  // perform validation after the fields state is updated
  useEffect(() => {
    validate();
  }, [formInputs]);

  useEffect(() => {
    dispatch(loadProjects(true));
  }, [dispatch]);

  useEffect(() => {
    const currentOptions = props.projects.map(
      (project): ProjectOption => ({
        id: project.id,
        title: props.allProjectMetadata[project.id].metadata?.title,
      })
    );
    currentOptions.unshift({ id: undefined, title: "" });
    // setShowProjectDetails(false);

    setProjectOptions(currentOptions);
  }, [props.allProjectMetadata]);

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
                    changeHandler={handleInput}
                  />
                  {showProjectDetails && (
                    <Accordion className="w-1/2 mt-4" allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              Project Details
                            </Box>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <ProjectDetails name={input.id} />
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  )}
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
                  placeholder={input.info}
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
                  placeholder={input.info}
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
                  placeholder={input.info}
                  name={`${input.id}`}
                  value={formInputs[`${input.id}`] ?? ""}
                  disabled={preview}
                  changeHandler={handleInput}
                />
              );
          }
        })}
        {/* Radio for safe or multi-sig */}
        <div className="relative mt-6">
          <Stack>
            <span className="absolute text-purple-700 inset-y-0 right-1/2">
              * required
            </span>
            <Radio
              label="Is your payout wallet a Gnosis Safe or multi-sig?"
              choices={["Yes", "No"]}
              changeHandler={() => {}}
              name="isSafe"
              value={formInputs.isSafe ?? "No"}
              info=""
            />
          </Stack>
        </div>
        {/* {!formValidation.valid && submitted && ( */}
        <div className="w-1/2 mt-4 border-2 rounded-md bg-red-300">
          <p className="text-white text-center font-semibold my-2">
            {/* {formValidation.message} */}
            ERROR MESSAGE
          </p>
        </div>
        {/* )} */}
        <div className="flex justify-end">
          {!preview ? (
            <Button
              disabled={!formValidation.valid}
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
    </div>
  );
}
