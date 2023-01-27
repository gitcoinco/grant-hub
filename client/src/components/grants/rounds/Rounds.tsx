import { Divider, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import { Status } from "../../../reducers/rounds";
import { Round, RoundDisplayType } from "../../../types";
import RoundStatGroup from "./RoundStatGroup";

export default function Rounds() {
  const currentApplications: Round[] = [];
  const activeRounds: Round[] = [];
  const pastRounds: Round[] = [];
  const params = useParams();

  const props = useSelector((state: RootState) => {
    const projectId = params.id!;
    const fullId = `${params.chainId}:${params.registryAddress}:${params.id}`;
    const applications = state.projects.applications[params.id!] || [];
    const roundIds = applications?.map((round) => round.roundID);
    const { rounds } = state;
    return {
      rounds,
      roundIds,
      projectId,
      fullId,
      applications,
    };
  });

  const renderStatGroup = (displayType: RoundDisplayType, rounds: Round[]) => (
    <RoundStatGroup
      key={props.fullId ?? Math.random().toString(36)}
      projectId={props.fullId ?? ""}
      applicationData={props.applications}
      displayType={displayType}
      rounds={rounds}
    />
  );

  function secondsSinceEpoch(): number {
    const date = new Date();
    return Math.floor(date.getTime() / 1000);
  }

  // Sort the applications into the correct categories
  if (props.applications) {
    props.applications.map((app) => {
      const rnd = props.rounds[app.roundID];
      if (
        rnd?.status === Status.Loaded &&
        rnd?.round?.address === app.roundID
      ) {
        const currentTime = secondsSinceEpoch();
        // Current Applications
        if (
          rnd.round.applicationsStartTime < currentTime &&
          rnd.round.applicationsEndTime > currentTime &&
          rnd.round.roundStartTime > currentTime &&
          rnd.round.roundEndTime > currentTime
        ) {
          currentApplications.push(rnd.round);
        }
        // Active Rounds
        if (
          rnd.round.roundEndTime > currentTime &&
          rnd.round.roundStartTime < currentTime &&
          rnd.round.applicationsEndTime < currentTime &&
          rnd.round.applicationsStartTime < currentTime
        ) {
          activeRounds.push(rnd.round);
        }
        // Past Rounds
        if (
          rnd.round.roundEndTime < currentTime &&
          rnd.round.roundStartTime < currentTime &&
          rnd.round.applicationsEndTime < currentTime &&
          rnd.round.applicationsStartTime < currentTime
        ) {
          pastRounds.push(rnd.round);
        }
      }
      return null;
    });
  }

  return (
    <div className="w-full mb-4">
      <div className="flex-col">
        {activeRounds.length > 0 ? (
          <div>
            {renderStatGroup(RoundDisplayType.Active, activeRounds)}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Active Rounds
            </span>
            {props.rounds[props.projectId]?.status !== Status.Loaded ? (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>Loading your information, please stand by...</span>
                <Spinner className="flex mt-4" />
              </div>
            ) : (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>No Data</span>
              </div>
            )}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        )}
        {currentApplications.length > 0 ? (
          <div>
            {renderStatGroup(RoundDisplayType.Current, currentApplications)}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Current Applications
            </span>
            {props.rounds[props.projectId]?.status !== Status.Loaded ? (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>Loading your information, please stand by...</span>
                <Spinner className="flex mt-4" />
              </div>
            ) : (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>No Data</span>
              </div>
            )}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        )}
        {pastRounds.length > 0 ? (
          <div>
            {renderStatGroup(RoundDisplayType.Past, pastRounds)}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Past Rounds
            </span>
            {props.rounds[props.projectId]?.status !== Status.Loaded ? (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>Loading your information, please stand by...</span>
                <Spinner className="flex mt-4" />
              </div>
            ) : (
              <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
                <span>No Data</span>
              </div>
            )}
            <Divider className="mb-8" borderColor="#E2E0E7" />
          </div>
        )}
      </div>
    </div>
  );
}
