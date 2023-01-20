import { Application } from "../../../reducers/projects";
import { LinkDisplayType } from "./LinkManager";
import RoundListItem from "./RoundListItem";

export default function RoundStatGroup({
  applicationData,
  displayType,
}: {
  applicationData?: Application;
  displayType: LinkDisplayType;
}) {
  let roundStatHeader: JSX.Element | undefined;
  const renderRoundStatHeader = () => {
    switch (displayType) {
      case LinkDisplayType.Active:
        roundStatHeader = (
          <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
            Active Rounds
          </span>
        );
        break;
      case LinkDisplayType.Current:
        roundStatHeader = (
          <span className="text-gitcoin-grey-500 text-[12px] font-semibold">
            Current Applications
          </span>
        );
        break;
      case LinkDisplayType.Past:
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

  renderRoundStatHeader();

  return (
    <div className="flex-1">
      {roundStatHeader}
      <RoundListItem
        applicationData={applicationData}
        displayType={displayType}
      />
    </div>
  );
}
