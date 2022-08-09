import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { formatDate } from "../../utils/components";
import Details from "../grants/Details";
import Button, { ButtonVariants } from "./Button";

export default function Preview() {
  const props = useSelector(
    (state: RootState) => ({
      metadata: state.projectForm.metadata,
      credentials: state.projectForm.credentials,
    }),
    shallowEqual
  );

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
        <Button variant={ButtonVariants.primary}>Save and Publish</Button>
      </div>
    </div>
  );
}
