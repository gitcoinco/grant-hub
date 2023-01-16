import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import RoundListItem from "./RoundListItem";

export default function Rounds() {
  const params = useParams();
  const props = useSelector((state: RootState) => {
    const { chains: projectChainId } = params;
    const allApplications = state.projects.applications[params.id!] || [];
    const approvedApplications =
      state.projects.applications[params.id!]?.filter(
        (app) => app.status === "APPROVED"
      ) || [];
    const pendingApplications =
      state.projects.applications[params.id!]?.filter(
        (app) => app.status === "PENDING"
      ) || [];
    const rejectedApplications =
      state.projects.applications[params.id!]?.filter(
        (app) => app.status === "REJECTED"
      ) || [];
    const applications = {
      all: allApplications,
      approved: approvedApplications,
      pending: pendingApplications,
      rejected: rejectedApplications,
    };
    const pastRounds: any[] = [];

    return {
      projectChainId,
      applications,
      pastRounds,
    };
  });

  console.log("props", props);

  return (
    <div className="w-full mb-40">
      {/* list the application details here for each round */}
      <span>Hello Rounds</span>
      {/* todo: setup logic for list item layouts for each category */}
      {props.applications.all.map((app) => (
        <RoundListItem applicationData={app} />
      ))}
    </div>
  );
}
