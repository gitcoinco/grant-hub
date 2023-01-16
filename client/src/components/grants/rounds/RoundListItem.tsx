import { useSelector } from "react-redux";
import { Badge } from "@chakra-ui/react";
import { RootState } from "../../../reducers";
import { Application } from "../../../reducers/projects";
// import { formatDate } from "../../../utils/components";

export default function RoundListItem({
  applicationData,
}: {
  applicationData: Application;
}) {
  const props = useSelector((state: RootState) => {
    // todo: get the round id
    const roundId = "1";

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
    <div className="w-full mb-40">
      {/* list the application details here for each round */}
      <span>Hello RoundListItem</span>
      {renderApplicationBadge()}
      {/* todo: list item layout */}
    </div>
  );
}
