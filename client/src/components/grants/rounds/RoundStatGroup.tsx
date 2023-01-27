import { Box, Divider } from "@chakra-ui/react";
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
    <Box>
      <Box className="flex-1">
        {roundStatHeader ?? null}
        {rounds.map((round) => {
          const appData = applicationData?.find(
            (app) => app.roundID === round.address
          );
          return (
            <>
              <RoundListItem
                key={Math.random() * 1000 + 3}
                applicationData={appData}
                displayType={displayType}
                projectId={projectId}
              />
              <Divider className="last-of-type:hidden" borderColor="#F3F3F5" />
            </>
          );
        })}
      </Box>
    </Box>
  );
}
