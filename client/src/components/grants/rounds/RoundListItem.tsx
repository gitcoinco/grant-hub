import { useSelector } from "react-redux";
import { Badge, Divider } from "@chakra-ui/react";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
import LinkManager, { LinkDisplayType } from "./LinkManager";
// import { formatDate } from "../../../utils/components";

export default function RoundListItem({
  applicationData,
}: {
  applicationData: Application;
}) {
  const props = useSelector((state: RootState) => {
    // todo: get the round id
    const roundId = applicationData.roundID;

    return {
      state,
      roundId,
    };
  });

  console.log("list item props", props);

  // const renderApplicationDate = () => (
  //   <>
  //     {formatDate(data.round?.applicationsStartTime)} -{" "}
  //     {formatDate(data.round?.applicationsEndTime)}
  //   </>
  // );

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

    return (
      <Badge
        colorScheme={colorScheme}
        className="bg-gitcoin-gray-100"
        borderRadius="full"
        p={2}
      >
        <span>{applicationData.status}</span>
      </Badge>
    );
  };

  return (
    <div>
      <div className="w-full my-8 flex flex-row justify-between align-middle">
        {/* todo: list the application details here for each round */}
        <div className="flex">
          <span>Program Name</span>
        </div>
        <div className="flex">
          <span>Round Name</span>
        </div>
        <div className="flex">
          <span>Dates</span>
        </div>
        <div className="flex">{renderApplicationBadge()}</div>
        <div className="flex">
          <LinkManager
            linkProps={{
              displayType: LinkDisplayType.External,
              link: "https://google.com",
              text: "View Application",
            }}
          />
        </div>
      </div>
      <Divider className="mb-8" />
    </div>
  );
}

// todo: add tests for this component
