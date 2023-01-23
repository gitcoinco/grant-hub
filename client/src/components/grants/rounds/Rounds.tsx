import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import { Round, RoundDisplayType } from "../../../types";
import RoundStatGroup from "./RoundStatGroup";

export default function Rounds() {
  const params = useParams();

  const props = useSelector((state: RootState) => {
    const projectId = params.id!;
    const applications = state.projects.applications[params.id!] || [];
    const { rounds } = state;

    return {
      rounds,
      projectId,
      applications,
    };
  });

  useEffect(() => {
    if (props.rounds) {
      // todo: sort the rounds by timestamp
      // props.rounds[props.projectId].round;
      // Active will be > applicationEndTime
      // Past will be > roundEndTime
      // Current will be > applicationStartTime & < applicationEndTime
    }
  }, [props.rounds]);

  const renderStatGroup = (round: Round, displayType: RoundDisplayType) => {
    if (displayType === RoundDisplayType.Active) {
      // Active Rounds
      return (
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Active}
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
        />
      );
    }
    if (displayType === RoundDisplayType.Current) {
      // Current Rounds
      return (
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Current}
        />
      );
    }

    return null;
  };

  console.log("JER Rounds props", { props });

  return (
    <div className="w-full mb-4">
      {/* list the application details here for each round category */}
      <div className="flex-col">
        {props.applications.map((app) => {
          const rnd = props.rounds[app.roundID];
          if (rnd?.round) {
            console.log("JER rnd.round", rnd.round);
            if (rnd.round.roundEndTime < Date.now()) {
              return renderStatGroup(rnd.round, RoundDisplayType.Past);
            }
          }

          return null;
        })}
      </div>
    </div>
  );
}
