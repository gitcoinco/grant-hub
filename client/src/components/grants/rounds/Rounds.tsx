import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import { LinkDisplayType } from "./LinkManager";
import RoundListItem from "./RoundListItem";

export default function Rounds() {
  const params = useParams();
  const props = useSelector((state: RootState) => {
    const { chains: projectChainId } = params;

    const allApplications = state.projects.applications[params.id!] || [];
    const applications = allApplications;
    // const roundState = state.rounds[applicationData.roundID];
    // const round = roundState ? roundState.round : undefined;

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
        {props.applications.map((app) => (
          <>
            <div className="flex-1">
              <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                Active Rounds
              </span>
              <RoundListItem
                applicationData={app}
                displayType={LinkDisplayType.External}
              />
            </div>
            <div className="flex-1">
              <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                Current Applications
              </span>
              <RoundListItem
                applicationData={app}
                displayType={LinkDisplayType.Internal}
              />
            </div>
            <div className="flex-1">
              <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
                Past Rounds
              </span>
              <RoundListItem
                applicationData={app}
                displayType={LinkDisplayType.Internal}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
