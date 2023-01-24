import { Badge, Box, Divider, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import { RoundDisplayType } from "../../../types";
import { formatDate } from "../../../utils/components";
import LinkManager from "./LinkManager";

export default function RoundListItem({
  applicationData,
  displayType,
}: {
  applicationData?: Application;
  displayType?: RoundDisplayType;
}) {
  let activeBadge: boolean;
  let pastBadge: boolean;
  const props = useSelector((state: RootState) => {
    const { roundID: roundId, chainId } = applicationData!;
    const roundState = state.rounds[roundId];
    const round = roundState ? roundState.round : undefined;

    return {
      state,
      round,
      roundId,
      chainId,
    };
  });

  const renderApplicationDate = () => (
    <>
      {formatDate(props.round?.roundStartTime!)} -{" "}
      {formatDate(props.round?.roundEndTime!)}
    </>
  );

  const renderApplicationBadge = (dt: RoundDisplayType) => {
    let colorScheme: string | undefined;
    switch (applicationData?.status) {
      case "APPROVED":
        colorScheme = "green";
        break;
      case "REJECTED":
        colorScheme = "red";
        break;
      case "PENDING":
        colorScheme = undefined;
        break;
      default:
        colorScheme = undefined;
        break;
    }

    activeBadge = dt === RoundDisplayType.Active;
    pastBadge = dt === RoundDisplayType.Past;

    if (!activeBadge && !pastBadge) {
      return (
        <Badge
          colorScheme={colorScheme}
          className="bg-gitcoin-gray-100 max-w-fit"
          borderRadius="full"
          p={2}
        >
          {applicationData?.status === "PENDING" ? (
            <span>In Review</span>
          ) : (
            <span>{applicationData?.status}</span>
          )}
        </Badge>
      );
    }

    if (pastBadge) {
      return (
        <div>
          {applicationData?.status === "PENDING" ||
          applicationData?.status === "REJECTED" ? (
            <span>Not Approved</span>
          ) : null}
          {applicationData?.status === "APPROVED" ? (
            <span>Approved</span>
          ) : null}
        </div>
      );
    }

    return <span className="text-green-500">Active</span>;
  };

  return (
    <Box>
      <Box className="w-full my-8 flex flex-row basis-0 justify-between items-center">
        <Box className="flex-1">
          {!props.round?.programName ? (
            <Spinner />
          ) : (
            <span>{props.round?.programName}</span>
          )}
        </Box>
        <Box className="flex-1">
          {!props.round?.roundMetadata.name ? (
            <Spinner />
          ) : (
            <span>{props.round?.roundMetadata.name}</span>
          )}
        </Box>
        <Box className="flex-1">
          {!props.round?.roundStartTime ? (
            <Spinner />
          ) : (
            <span>{renderApplicationDate()}</span>
          )}
        </Box>
        <Box className="flex-1">{renderApplicationBadge(displayType!)}</Box>
        <Box className="flex-1">
          {displayType === RoundDisplayType.Active ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Active,
                link: "/",
                text: "View on Explorer",
              }}
            />
          ) : null}
          {displayType === RoundDisplayType.Current ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Current,
                link: "/",
                text: "View Application",
              }}
            />
          ) : null}
          {displayType === RoundDisplayType.Past ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Past,
                link: "https://google.com",
                text: "View Stats",
              }}
            />
          ) : null}
        </Box>
      </Box>
      <Divider className="mb-8" />
    </Box>
  );
}

// todo: add tests for this component
