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
    const applications = state.projects.applications[params.id!] || [];
    const roundIds = applications?.map((round) => round.roundID);
    const { rounds } = state;

    return {
      rounds,
      roundIds,
      projectId,
      applications,
    };
  });

  const renderStatGroup = (displayType: RoundDisplayType, rounds: Round[]) => {
    if (displayType === RoundDisplayType.Active) {
      // Active Rounds
      return (
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Active}
          rounds={rounds}
        />
      );
    }
    if (displayType === RoundDisplayType.Past) {
      // Past Rounds
      return (
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Past}
          rounds={rounds}
        />
      );
    }
    if (displayType === RoundDisplayType.Current) {
      // Current Applications
      return (
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Current}
          rounds={rounds}
        />
      );
    }

    return null;
  };

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

  return (
    <div className="w-full mb-4">
      <div className="flex-col">
        {activeRounds.length > 0
          ? renderStatGroup(RoundDisplayType.Active, activeRounds)
          : null}
        {currentApplications.length > 0
          ? renderStatGroup(RoundDisplayType.Current, currentApplications)
          : null}
        {pastRounds.length > 0
          ? renderStatGroup(RoundDisplayType.Past, pastRounds)
          : null}
      </div>
    </div>
  );
}
