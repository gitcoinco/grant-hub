import { Badge, Divider, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadRoundStats } from "../../../actions/rounds";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import { formatDate } from "../../../utils/components";
import LinkManager, {
  InternalLinkDisplayType,
  LinkDisplayType,
} from "./LinkManager";

export default function RoundListItem({
  applicationData,
  displayType,
}: {
  applicationData?: Application;
  displayType: LinkDisplayType;
}) {
  const dispatch = useDispatch();
  const [activeBadge] = useState(false);
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

  console.log("list item props", props);

  useEffect(() => {
    dispatch(loadRoundStats(props.roundId, props.chainId));
  }, [dispatch, props.roundId]);

  const renderApplicationDate = () => (
    <>
      {formatDate(props.round?.roundStartTime!)} -{" "}
      {formatDate(props.round?.roundEndTime!)}
    </>
  );

  const renderApplicationBadge = () => {
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

    if (!activeBadge) {
      return (
        <Badge
          colorScheme={colorScheme}
          className="flex justify-center items-center bg-gitcoin-gray-100"
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

    return <span className="text-green-500">Active</span>;
  };

  return (
    <div>
      <div className="w-full my-8 flex flex-row justify-between items-center">
        {/* todo: list the application details here for each round */}
        <div className="flex justify-center items-center">
          {!props.round?.programName ? (
            <Spinner />
          ) : (
            <span>{props.round?.programName}</span>
          )}
        </div>
        <div className="flex justify-center items-center">
          {!props.round?.roundMetadata.name ? (
            <Spinner />
          ) : (
            <span>{props.round?.roundMetadata.name}</span>
          )}
        </div>
        <div className="flex justify-center items-center">
          {!props.round?.roundStartTime ? (
            <Spinner />
          ) : (
            <span>{renderApplicationDate()}</span>
          )}
        </div>
        <div className="flex justify-center items-center">
          {renderApplicationBadge()}
        </div>
        <div className="flex">
          {displayType === LinkDisplayType.Internal ? (
            // todo: figure out what we need for the proper link display
            <LinkManager
              linkProps={{
                displayType: LinkDisplayType.Internal,
                internalType: InternalLinkDisplayType.Application,
                link: "/",
                text: "View Application",
              }}
            />
          ) : (
            <LinkManager
              linkProps={{
                displayType: LinkDisplayType.External,
                link: "https://google.com",
                text: "View on Explorer",
              }}
            />
          )}
        </div>
      </div>
      <Divider className="mb-8" />
    </div>
  );
}

// todo: add tests for this component
