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

    const activeRounds: any[] = [];
    const currentRounds: any[] = [];
    const pastRounds: any[] = [];

    // todo: setup the values for each above ^^

    return {
      projectChainId,
      applications,
      activeRounds,
      currentRounds,
      pastRounds,
    };
  });

  console.log("props", props);

  return (
    <div className="w-full mb-4">
      {/* list the application details here for each round */}
      {/* todo: setup logic for list item layouts for each category */}
      <div className="flex-col">
        {props.applications.all.map((app) => {
          if (app.status === "APPROVED") {
            // todo:
          }
          return (
            <>
              <div className="flex-1">
                <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                  Active Rounds
                </span>
                <RoundListItem applicationData={app} />
              </div>
              <div className="flex-1">
                <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                  Current Applications
                </span>
                <RoundListItem applicationData={app} />
              </div>
              <div className="flex-1">
                <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                  Past Rounds
                </span>
                <RoundListItem applicationData={app} />
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
