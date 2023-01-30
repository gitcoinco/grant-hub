// eslint-disable max-len
import { Badge, Box, Divider, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import { roundApplicationPathForProject } from "../../../routes";
import { RoundDisplayType } from "../../../types";
import { formatDateFromSecs } from "../../../utils/components";
import generateUniqueRoundApplicationID from "../../../utils/roundApplication";
import { getProjectURIComponents } from "../../../utils/utils";
import LinkManager from "./LinkManager";

export default function RoundListItem({
  applicationData,
  displayType,
  projectId,
}: {
  applicationData?: Application;
  displayType?: RoundDisplayType;
  projectId: string;
}) {
  let activeBadge: boolean;
  let pastBadge: boolean;
  const props = useSelector((state: RootState) => {
    const { roundID: roundId, chainId: projectChainId } = applicationData!;
    const roundState = state.rounds[roundId];
    const round = roundState ? roundState.round : undefined;
    const roundAddress = round?.address;
    const {
      chainId: roundChain,
      registryAddress,
      id,
    } = getProjectURIComponents(projectId);
    const generatedProjectId = generateUniqueRoundApplicationID(
      projectChainId,
      id,
      registryAddress
    );

    return {
      round,
      roundId,
      roundChain,
      roundAddress,
      projectId: id,
      generatedProjectId,
    };
  });

  const renderApplicationDate = () => (
    <>
      {formatDateFromSecs(props.round?.roundStartTime!)} -{" "}
      {formatDateFromSecs(props.round?.roundEndTime!)}
    </>
  );

  const renderApplicationBadge = (dt: RoundDisplayType) => {
    let colorScheme: string | undefined;
    switch (applicationData?.status) {
      case "APPROVED":
        colorScheme = "bg-[#E6FFF9]";
        break;
      case "REJECTED":
        colorScheme = "bg-[#FAADBFd]";
        break;
      case "PENDING":
        colorScheme = "bg-[#E2E0E7]";
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
          className={`bg-gitcoin-gray-100 max-w-fit ${colorScheme}`}
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

    if (applicationData?.status === "PENDING") {
      return <span className="text-gitcoin-grey-400">In Review</span>;
    }

    if (applicationData?.status === "REJECTED") {
      return <span className="text-gitcoin-pink-400">Rejected</span>;
    }

    return <span className="text-gitcoin-teal-500 ml-4 lg:ml-2">Active</span>;
  };

  const applicationLink = roundApplicationPathForProject(
    props.roundChain!,
    props.roundAddress!,
    projectId
  );

  // add check for application status
  const enableStatusButton = () => applicationData?.status === "APPROVED";

  return (
    <Box>
      <Box className="w-full my-8 lg:flex md:flex basis-0 justify-between items-center text-[14px] text-gitcoin-grey-400">
        <Box className="flex-1 my-2">
          {!props.round?.programName ? (
            <Spinner />
          ) : (
            <span>{props.round?.programName}</span>
          )}
        </Box>
        <Box className="flex-1 my-2">
          {!props.round?.roundMetadata.name ? (
            <Spinner />
          ) : (
            <span>{props.round?.roundMetadata.name}</span>
          )}
        </Box>
        <Box className="flex-1 my-2">
          {!props.round?.roundStartTime ? (
            <Spinner />
          ) : (
            <span>{renderApplicationDate()}</span>
          )}
        </Box>
        <Box className="flex-1 my-2">
          {renderApplicationBadge(displayType!)}
        </Box>
        <Box className="flex-1 my-2">
          {displayType === RoundDisplayType.Active ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Active,
                link:
                  `https://grant-explorer.gitcoin.co/#/round/${props.roundChain}/` +
                  `${props.roundAddress}/${props.generatedProjectId}-${props.roundAddress}`,
                text: "View on Explorer",
                applicationStatus: applicationData?.status!,
              }}
            />
          ) : null}
          {/* todo: add check for application status */}
          {displayType === RoundDisplayType.Current ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Current,
                link: applicationLink,
                text: "View Application",
                applicationStatus: applicationData?.status!,
              }}
            />
          ) : null}
          {displayType === RoundDisplayType.Past ? (
            <LinkManager
              linkProps={{
                displayType: RoundDisplayType.Past,
                link: `https://round-manager.gitcoin.co/#/round/${props.roundAddress}`,
                text: "View Stats",
                enableStats: enableStatusButton(),
                applicationStatus: applicationData?.status!,
              }}
            />
          ) : null}
        </Box>
        <Divider className="last-of-type:hidden" borderColor="#F3F3F5" />
      </Box>
    </Box>
  );
}

// todo: add tests for this component
