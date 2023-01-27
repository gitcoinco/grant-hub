import { Divider, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import { Status } from "../../../reducers/rounds";
import { RoundDisplayType } from "../../../types";
import Round from "../../rounds/Show";
import RoundListItem from "./RoundListItem";

const displayHeaders = {
  [RoundDisplayType.Active]: "Active Rounds",
  [RoundDisplayType.Current]: "Current Applications",
  [RoundDisplayType.Past]: "Past Rounds",
};

export default function Rounds() {
  const params = useParams();

  const props = useSelector((state: RootState) => {
    const projectId = params.id!;
    const fullId = `${params.chainId}:${params.registryAddress}:${params.id}`;
    const { rounds } = state;

    const applications =
      state.projects.applications[params.id!]?.reduce(
        (acc: { [key in RoundDisplayType]?: Application[] }, app) => {
          const roundState = state.rounds[app.roundID];
          let category = null;

          if (!roundState) return acc;

          const status = roundState.status ?? Status.Undefined;
          const round = roundState.round;

          if (status === Status.Loaded && round) {
            const currentTime = secondsSinceEpoch();
            // Current Applications
            if (
              round.applicationsStartTime < currentTime &&
              round.applicationsEndTime > currentTime &&
              round.roundStartTime > currentTime &&
              round.roundEndTime > currentTime
            ) {
              category = RoundDisplayType.Current;
            }
            // Active Rounds
            if (
              round.roundEndTime > currentTime &&
              round.roundStartTime < currentTime &&
              round.applicationsEndTime < currentTime &&
              round.applicationsStartTime < currentTime
            ) {
              category = RoundDisplayType.Active;
            }
            // Past Rounds
            if (
              round.roundEndTime < currentTime &&
              round.roundStartTime < currentTime &&
              round.applicationsEndTime < currentTime &&
              round.applicationsStartTime < currentTime
            ) {
              category = RoundDisplayType.Past;
            }
          }

          if (!category) {
            return acc;
          }

          acc[category] = acc[category] ?? [];
          acc[category]!.push(app);

          return acc;
        },
        {}
      ) ?? {};

    return {
      rounds,
      projectId,
      fullId,
      applications,
    };
  });

  const renderStatGroup = (
    displayType: RoundDisplayType,
    applications?: Application[]
  ) => (
    <div>
      <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
        {displayHeaders[displayType]}
      </span>
      {applications &&
        applications.length > 0 &&
        applications.map((app, i) => {
          return (
            <div key={i}>
              <RoundListItem
                applicationData={app}
                displayType={displayType as RoundDisplayType}
                projectId={props.fullId}
              />
              <Divider className="last-of-type:hidden" borderColor="#F3F3F5" />
            </div>
          );
        })}
      {applications && applications.length == 0 && (
        <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
          <span>No Data</span>
        </div>
      )}
      {applications === undefined && (
        <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
          <span>Loading your information, please stand by...</span>
          <Spinner className="flex mt-4" />
        </div>
      )}
      <Divider className="mb-8" borderColor="#E2E0E7" />
    </div>
  );

  function secondsSinceEpoch(): number {
    const date = new Date();
    return Math.floor(date.getTime() / 1000);
  }

  // Sort the applications into the correct categories

  return (
    <div className="w-full mb-4">
      <div className="flex-col">
        {Object.values(RoundDisplayType).map((displayType) => (
          <div key={displayType}>
            {renderStatGroup(
              displayType as RoundDisplayType,
              props.applications[displayType as RoundDisplayType]
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
