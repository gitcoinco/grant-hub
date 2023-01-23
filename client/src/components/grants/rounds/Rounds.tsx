import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import { Round, RoundDisplayType, RoundStats } from "../../../types";
import RoundStatGroup from "./RoundStatGroup";

export default function Rounds() {
  const params = useParams();

  const activeRounds: Round[] = [];
  const currentRounds: Round[] = [];
  const pastRounds: Round[] = [];
  // Round Stats for specific project id
  const roundStats: RoundStats = {
    [params.id!]: {
      activeRounds,
      currentRounds,
      pastRounds,
    },
  };

  const props = useSelector((state: RootState) => {
    const { chain: projectChainId } = params;
    const projectId = params.id!;
    const applications = state.projects.applications[params.id!] || [];

    return {
      state,
      projectId,
      projectChainId,
      applications,
    };
  });

  console.log("JER Rounds props", { props, roundStats });

  useEffect(() => {
    if (props.state.rounds) {
      // eslint-disable-next-line
      props.applications.map((app) => {
        const rnd = props.state.rounds[app.roundID];
        if (rnd?.round) {
          // Active Round
          if (
            rnd.round.roundStartTime > Date.now() &&
            rnd.round.roundEndTime > Date.now()
          ) {
            roundStats[props.projectId].activeRounds.push(rnd.round);
          } else if (
            rnd.round.roundStartTime < Date.now() &&
            rnd.round.roundEndTime < Date.now()
          ) {
            roundStats[props.projectId].pastRounds.push(rnd.round);
          } else {
            roundStats[props.projectId].currentRounds.push(rnd.round);
          }
        }
        console.log("JER rnd", rnd);
      });
    }
  }, [props.applications]);

  console.log("JER Rounds", { roundStats });

  return (
    <div className="w-full mb-4">
      {/* list the application details here for each round */}
      {/* todo: setup logic for list item layouts for each category */}
      <div className="flex-col">
        <RoundStatGroup
          projectId={props.projectId ?? ""}
          applicationData={props.applications}
          displayType={RoundDisplayType.Past}
        />
      </div>
    </div>
  );
}
