import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { publishGrant, resetStatus } from "../../actions/newGrant";
import { RootState } from "../../reducers";
import { Status } from "../../reducers/newGrant";
import { formatDate } from "../../utils/components";
import Details from "../grants/Details";
import Button, { ButtonVariants } from "./Button";
import Toast from "./Toast";
import TXLoading from "./TXLoading";

export default function Preview({
  currentProjectId,
}: {
  currentProjectId?: string;
}) {
  const dispatch = useDispatch();

  const [submitted, setSubmitted] = useState(false);
  const [show, showToast] = useState(false);

  const props = useSelector(
    (state: RootState) => ({
      metadata: state.projectForm.metadata,
      credentials: state.projectForm.credentials,
      status: state.newGrant.status,
      error: state.newGrant.error,
    }),
    shallowEqual
  );

  const localResetStatus = () => {
    setSubmitted(false);
    dispatch(resetStatus());
  };

  const publishProject = async () => {
    setSubmitted(true);
    localResetStatus();
    showToast(true);
    await dispatch(publishGrant(currentProjectId));
  };

  return (
    <div>
      <Details
        updatedAt={formatDate(Date.now() / 1000)}
        project={props.metadata}
        logoImg={props.metadata?.logoImg ?? "./icons/lightning.svg"}
        bannerImg={props.metadata?.bannerImg ?? "./assets/card-img.png"}
      />
      <div className="flex justify-end">
        <Button variant={ButtonVariants.outline}>Back to Editing</Button>
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
        fadeOut={props.status === Status.Completed}
        onClose={() => showToast(false)}
        error={props.status === Status.Error}
      >
        <TXLoading status={props.status} error={props.error} />
      </Toast>
    </div>
  );
}
