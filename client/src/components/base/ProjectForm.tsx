import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { ValidationError } from "yup";
import fetchGrantData from "../../actions/grantsMetadata";
import { useClients } from "../../hooks/useDataClient";
import { ChangeHandlers, FormInputs, ProjectFormStatus } from "../../types";
import { TextArea, TextInput, WebsiteInput } from "../grants/inputs";
import Button, { ButtonVariants } from "./Button";
import ExitModal from "./ExitModal";
import { validateProjectForm } from "./formValidation";
import ImageInput from "./ImageInput";

const validation = {
  message: "",
  valid: false,
};

function ProjectForm({
  currentProjectId,
  setVerifying,
}: {
  currentProjectId?: string;
  setVerifying: (verifying: ProjectFormStatus) => void;
}) {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  /*
  const props = useSelector((state: RootState) => {
    const grantMetadata = state.grantsMetadata[Number(currentProjectId)];
    return {
      id: currentProjectId,
      loading: grantMetadata ? grantMetadata.loading : false,
      currentProject: grantMetadata?.metadata,
      status: state.newGrant.status,
      error: state.newGrant.error,
      formMetaData: state.projectForm.metadata,
    };
  }, shallowEqual);
*/
  const [loading, setLoading] = useState(currentProjectId !== undefined);
  // const [status, setStatus] = useState(Status.Undefined);

  const [grantData, setGrantData] = useState<any>();
  const [formValidation, setFormValidation] = useState(validation);
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, toggleModal] = useState(false);

  const [logoImg, setLogoImg] = useState<Blob | undefined>();
  const [bannerImg, setBannerImg] = useState<Blob | undefined>();
  const [formInputs, setFormInputs] = useState<FormInputs | null>(null);

  const { chain } = useNetwork();

  const { grantHubClient } = useClients();

  /*
    

  const localResetStatus = () => {
    setSubmitted(false);
    setFormValidation(validation);
    // dispatch(resetStatus());
  };
  const [logoImg, setLogoImg] = useState<Blob | undefined>();
  const [bannerImg, setBannerImg] = useState<Blob | undefined>();

  

  const publishProject = async () => {
    setSubmitted(true);
    if (!formValidation.valid) return;
    localResetStatus();
    showToast(true);

    console.log(
      "TODO(@DanieleSalatti): publish grant and then set status correctly"
    );
    // TODO(@DanieleSalatti): publish grant and then set status correctly
    publishGrant(currentProjectId, formInputs, {
      bannerImg,
      logoImg,
    });
    setError(
      "TODO(@DanieleSalatti): publish grant and then set status correctly"
  */

  const handleInput = (e: ChangeHandlers) => {
    console.log("DASA handleInput", e.target.name);
    console.log("DASA handleInput", e.target);

    const { value } = e.target;
    setFormInputs({
      ...formInputs,
      [e.target.name]: value,
      bannerImg,
      logoImg,
    });
    /*
    dispatch(
      metadataSaved({
        ...props.formMetaData,
        [e.target.name]: value,
        bannerImg,
        logoImg,
      })
    );
    */
    // setStatus(Status.Completed);
  };

  const getGrantData = async () => {
    if (!chain || !currentProjectId || !grantHubClient) {
      return;
    }
    const data = await fetchGrantData(grantHubClient, Number(currentProjectId));

    setGrantData(data);
    setLoading(false);
  };

  useEffect(() => {
    getGrantData();
  }, []);
  /*
  useEffect(() => {
    if (status === Status.Completed) {
      setTimeout(() => navigate(slugs.grants), 1500);
    }
  }, [status]);
*/
  // TODO: feels like this could be extracted to a component

  useEffect(() => {
    if (grantData) {
      /*
      metadataSaved({
        ...grantData,
      });
      */

      if (formInputs) {
        return;
      }
      setFormInputs({
        title: grantData.title,
        description: grantData.description,
        website: grantData.website,
      });
    }
  }, [currentProjectId, grantData]);

  const validate = async () => {
    try {
      await validateProjectForm(formInputs!);
      setFormValidation({
        message: "",
        valid: true,
      });
    } catch (e) {
      const validationError = e as ValidationError;
      setFormValidation({
        message: validationError.message,
        valid: false,
      });
    }
  };
  // perform validation after the fields state is updated
  useEffect(() => {
    validate();
  }, [formInputs]);

  const nextStep = () => {
    setSubmitted(true);
    if (formValidation.valid) {
      setVerifying(ProjectFormStatus.Verification);
    }
  };
  /*
  useEffect(() => {
    if (status === Status.Completed) {
      setFormInputs(initialFormValues);
    }
  }, [status]);
  */

  if (loading) {
    return <>Loading grant data from IPFS... </>;
  }

  return (
    <div className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <TextInput
          label="Project Name"
          name="title"
          placeholder="What's the project name?"
          value={formInputs?.title}
          changeHandler={handleInput}
        />
        <WebsiteInput
          label="Project Website"
          name="website"
          value={formInputs?.website}
          changeHandler={handleInput}
        />
        <ImageInput
          label="Project Logo"
          dimensions={{
            width: 300,
            height: 300,
          }}
          circle
          existingImg={grantData?.logoImg}
          imgHandler={(buffer: Blob) => setLogoImg(buffer)}
        />
        <ImageInput
          label="Project Banner"
          dimensions={{
            width: 1500,
            height: 500,
          }}
          existingImg={grantData?.bannerImg}
          imgHandler={(buffer: Blob) => setBannerImg(buffer)}
        />
        <TextInput
          label="Project Twitter"
          name="projectTwitter"
          placeholder="twitterusername"
          value={formInputs?.projectTwitter}
          changeHandler={handleInput}
        />
        <TextInput
          label="Your Github Username"
          name="userGithub"
          placeholder="githubusername"
          value={formInputs?.userGithub}
          changeHandler={handleInput}
        />
        <TextInput
          label="Project Github Organization"
          name="projectGithub"
          placeholder="githuborgname"
          value={formInputs?.projectGithub}
          changeHandler={handleInput}
        />
        <TextArea
          label="Project Description"
          name="description"
          placeholder="What is the project about and what kind of impact does it aim to have?"
          value={formInputs?.description}
          changeHandler={handleInput}
        />
        {!formValidation.valid && submitted && (
          <p className="text-danger-text w-full text-center font-semibold my-2">
            {formValidation.message}
          </p>
        )}
        <div className="flex w-full justify-end mt-6">
          <Button
            variant={ButtonVariants.outline}
            onClick={() => toggleModal(true)}
          >
            Cancel
          </Button>
          <Button
            disabled={!formValidation.valid && submitted}
            variant={ButtonVariants.primary}
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      </form>
      <ExitModal modalOpen={modalOpen} toggleModal={toggleModal} />
    </div>
  );
}

export default ProjectForm;
