import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { RootState } from "../../../reducers";
import { Round, RoundStats } from "../../../types";
import RoundStatGroup from "./RoundStatGroup";
import { LinkDisplayType } from "./LinkManager";

export default function Rounds() {
  const { address } = useAccount();
  const activeRounds: Round[] = [];
  const currentRounds: Round[] = [];
  const pastRounds: Round[] = [];
  const roundStats: RoundStats = {
    [address ?? ""]: {
      activeRounds,
      currentRounds,
      pastRounds,
    },
  };

  const params = useParams();
  const props = useSelector((state: RootState) => {
    const { chains: projectChainId } = params;

    const allApplications = state.projects.applications[params.id!] || [];
    const applications = allApplications;

    return {
      state,
      projectChainId,
      applications,
    };
  });

  console.log("JER props", { props, roundStats });

  useEffect(() => {
    if (props.state.rounds) {
      // eslint-disable-next-line
      props.applications.map((app) => {
        const rnd = props.state.rounds[app.roundID];
        if (rnd?.round) {
          if (
            rnd.round.roundStartTime > Date.now() &&
            rnd.round.roundEndTime > Date.now()
          ) {
            activeRounds.push(rnd.round);
          } else if (
            rnd.round.roundStartTime < Date.now() &&
            rnd.round.roundEndTime < Date.now()
          ) {
            pastRounds.push(rnd.round);
          }
        }
        console.log("JER rnd", rnd);
      });
    }
  }, [props.applications, activeRounds, pastRounds, currentRounds]);

  console.log("JER Rounds", { activeRounds, currentRounds, pastRounds });

  return (
    <div className="w-full mb-4">
      {/* list the application details here for each round */}
      {/* todo: setup logic for list item layouts for each category */}
      <div className="flex-col">
        {props.applications.map((app) => (
          <RoundStatGroup
            applicationData={app}
            displayType={LinkDisplayType.Past}
          />
        ))}
      </div>
    </div>
  );
}
