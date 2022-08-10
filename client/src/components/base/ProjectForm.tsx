import { useEffect, useState } from "react";
import { ValidationError } from "yup";
import { useNavigate } from "react-router-dom";
import { useNetwork } from "wagmi";
import { TextArea, TextInput, WebsiteInput } from "../grants/inputs";
import ImageInput from "./ImageInput";
import fetchGrantData from "../../actions/grantsMetadata";
import Button, { ButtonVariants } from "./Button";
import { publishGrant } from "../../actions/newGrant";
import { validateProjectForm } from "./formValidation";
import { Status } from "../../reducers/newGrant";
import Toast from "./Toast";
import TXLoading from "./TXLoading";
import ExitModal from "./ExitModal";
import { slugs } from "../../routes";
import { ChangeHandlers } from "../../types";
import { useClients } from "../../hooks/useDataClient";

const initialFormValues = {
  title: "",
  description: "",
  website: "",
};

const validation = {
  message: "",
  valid: false,
};

function ProjectForm({ currentProjectId }: { currentProjectId?: string }) {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  /*
  const props = useSelector((state: RootState) => {
    const grantMetadata = state.grantsMetadata[Number(currentProjectId)];
    return {
      id: currentProjectId,
      loading: grantMetadata ? grantMetadata.loading : false,
      currentProject: grantMetadata?.metadata,
      status: state.newGrant.status,
      error: state.newGrant.error,
    };
  }, shallowEqual);
*/
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(Status.Undefined);

  const [grantData, setGrantData] = useState<any>();
  const [formValidation, setFormValidation] = useState(validation);
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [formInputs, setFormInputs] = useState(initialFormValues);
  const [show, showToast] = useState(false);
  const [modalOpen, toggleModal] = useState(false);

  const { chain } = useNetwork();

  const localResetStatus = () => {
    setSubmitted(false);
    setFormValidation(validation);
    // dispatch(resetStatus());
  };
  const [logoImg, setLogoImg] = useState<Blob | undefined>();
  const [bannerImg, setBannerImg] = useState<Blob | undefined>();

  const { grantHubClient } = useClients();

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
    );
    setStatus(Status.Completed);
  };

  useEffect(() => {
    console.log("grantData", grantData);
  }, [grantData]);

  const getGrantData = async () => {
    if (!chain || !currentProjectId || !grantHubClient) {
      console.log("DASA chain is ", chain);
      console.log("DASA currentProjectId is ", currentProjectId);
      return;
    }
    const data = await fetchGrantData(grantHubClient, Number(currentProjectId));

    setGrantData(data);
    setLoading(false);
    console.log("DASA DATA", data);
  };

  useEffect(() => {
    getGrantData();
  }, []);

  const handleInput = (e: ChangeHandlers) => {
    const { value } = e.target;
    setFormInputs({ ...formInputs, [e.target.name]: value });
  };

  useEffect(() => {
    if (status === Status.Completed) {
      setTimeout(() => navigate(slugs.grants), 1500);
    }
  }, [status]);

  // TODO: feels like this could be extracted to a component
  useEffect(() => {
    if (grantData) {
      setFormInputs({
        title: grantData.title,
        description: grantData.description,
        website: grantData.website,
      });
    }
  }, [currentProjectId, grantData]);

  const validate = async () => {
    try {
      await validateProjectForm(formInputs);
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

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      localResetStatus();
    };
  }, []);

  useEffect(() => {
    if (status === Status.Completed) {
      setFormInputs(initialFormValues);
    }
  }, [status]);

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
          value={formInputs.title}
          changeHandler={handleInput}
        />
        <WebsiteInput
          label="Project Website"
          name="website"
          value={formInputs.website}
          changeHandler={handleInput}
        />
        <ImageInput
          label="Project Logo"
          dimensions={{
            width: 300,
            height: 300,
          }}
          circle
          currentProject={grantData}
          imgHandler={(buffer: Blob) => setLogoImg(buffer)}
        />
        <ImageInput
          label="Project Banner"
          dimensions={{
            width: 1500,
            height: 500,
          }}
          currentProject={grantData}
          imgHandler={(buffer: Blob) => setBannerImg(buffer)}
        />
        <TextArea
          label="Project Description"
          name="description"
          placeholder="What is the project about and what kind of impact does it aim to have?"
          value={formInputs.description}
          changeHandler={handleInput}
        />
        {!formValidation.valid && submitted && (
          <p className="text-danger-text w-full text-center font-semibold my-2">
            {formValidation.message}
          </p>
        )}
        <div className="flex w-full justify-end mt-6">
          <Button
            disabled={!formValidation.valid && submitted}
            variant={ButtonVariants.outline}
            onClick={() => toggleModal(true)}
          >
            Cancel
          </Button>
          <Button
            disabled={!formValidation.valid && submitted}
            variant={ButtonVariants.primary}
            onClick={publishProject}
          >
            Save &amp; Publish
          </Button>
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
      <ExitModal modalOpen={modalOpen} toggleModal={toggleModal} />
    </div>
  );
}

export default ProjectForm;
