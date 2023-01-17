import { Badge, Divider } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
// import { loadRound } from "../../../actions/rounds";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import LinkManager, {
  InternalLinkDisplayType,
  LinkDisplayType,
} from "./LinkManager";
import { formatDate } from "../../../utils/components";

export default function RoundListItem({
  applicationData,
  displayType,
}: {
  applicationData: Application;
  displayType: LinkDisplayType;
}) {
  // const dispatch = useDispatch();
  const [activeBadge] = useState(false);
  const props = useSelector((state: RootState) => {
    const { roundID: roundId, chainId } = applicationData;
    // const roundChain = Number(chainId);
    // dispatch<any>(loadRound(roundId, roundChain));

    return {
      state,
      roundId,
      chainId,
    };
  });

  console.log("list item props", props);

  const renderApplicationDate = () => (
    <>
      {formatDate(1673992683)} - {formatDate(1673992683)}
    </>
  );

  const renderApplicationBadge = () => {
    let colorScheme: string | undefined;
    switch (applicationData.status) {
      case "APPROVED":
        colorScheme = "green";
        break;
      case "REJECTED":
        colorScheme = "red";
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
          {applicationData.status ? (
            <span>{applicationData.status}</span>
          ) : null}
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
          <span>Gitcoin</span>
        </div>
        <div className="flex justify-center items-center">
          <span>Open Source Software</span>
        </div>
        <div className="flex justify-center items-center">
          <span>{renderApplicationDate()}</span>
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
