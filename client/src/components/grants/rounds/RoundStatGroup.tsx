import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import { Round, RoundDisplayType } from "../../../types";
import RoundListItem from "./RoundListItem";

export default function RoundStatGroup({
  projectId,
  applicationData,
  displayType,
  rounds,
}: {
  projectId: string;
  applicationData?: Application[];
  displayType: RoundDisplayType;
  rounds: Round[];
}) {
  let roundStatHeader: JSX.Element | undefined;
  const props = useSelector((state: RootState) => {
    const applications = state.projects.applications[projectId] || [];
    const { rounds: roundState } = state;

    return {
      state,
      roundState,
      applications,
    };
  });

  console.log("JER stat group props", { props, rounds });

  const renderRoundStatHeader = () => {
    switch (displayType) {
      case RoundDisplayType.Active:
        roundStatHeader = (
          <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
            Active Rounds
          </span>
        );
        break;
      case RoundDisplayType.Current:
        roundStatHeader = (
          <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
            Current Applications
          </span>
        );
        break;
      case RoundDisplayType.Past:
        roundStatHeader = (
          <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
            Past Rounds
          </span>
        );
        break;
      default:
        break;
    }
  };

  if (displayType) {
    renderRoundStatHeader();
  }

  return (
    <Box className="flex-1">
      {roundStatHeader ?? null}
      {rounds.map((round) => {
        console.log("JER round map", { round });
        const appData = applicationData?.find(
          (app) => app.roundID === round.address
        );
        return (
          <RoundListItem applicationData={appData} displayType={displayType} />
        );
      })}
    </Box>
  );
}
