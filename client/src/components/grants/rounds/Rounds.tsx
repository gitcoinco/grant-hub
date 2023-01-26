import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
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
    console.log(state);
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

  if (props.applications) {
    props.applications.map((app) => {
      const rnd = props.rounds[app.roundID];
      if (rnd?.round?.address === app.roundID) {
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

  // if (
  //     activeRounds.length === 0 &&
  //     currentApplications.length === 0 &&
  //     pastRounds.length === 0
  //   ) {
  //     return (
  //       <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
  //         <span>Loading your information, please stand by...</span>
  //         <Spinner className="flex mt-4" />
  //       </div>
  //     );
  //   }

  return (
    <div className="w-full mb-4">
      <div className="flex-col">
        {activeRounds.length > 0 ? (
          renderStatGroup(RoundDisplayType.Active, activeRounds)
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Active Rounds
            </span>
            <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
              {/* todo: add loading state */}
              <span>No Data</span>
            </div>
          </div>
        )}
        {currentApplications.length > 0 ? (
          renderStatGroup(RoundDisplayType.Current, currentApplications)
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Current Applications
            </span>
            <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
              <span>No Data</span>
            </div>
          </div>
        )}
        {pastRounds.length > 0 ? (
          renderStatGroup(RoundDisplayType.Past, pastRounds)
        ) : (
          <div>
            <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
              Past Rounds
            </span>
            <div className="text-base text-gitcoin-grey-400 flex flex-col items-center justify-center p-10">
              <span>No Data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
