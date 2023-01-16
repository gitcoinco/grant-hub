import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../reducers";
import RoundDetailsCard from "./RoundDetailsCard";
import StatCard from "./StatCard";

const DummyData = {
  fundingReceived: "385.4055852789264",
  uniqueContributors: "30",
  avgContribution: "5.132435352789264",
  totalContributions: "321",
};

export default function RoundStats() {
  const params = useParams();
  const props = useSelector((state: RootState) => {
    // todo: also get not approved rounds, because a project could have been rejected during a round?
    const applications =
      state.projects.applications[params.id!]?.filter(
        (app) => app.status === "APPROVED"
      ) || [];

    const details: any[] = [];
    const allTimeStats = {
      fundingReceived: 0,
      uniqueContributors: 0,
      roundsLength: 0,
    };

    applications.forEach((app) => {
      details.push({
        application: app,
        round: state.rounds[app.roundID].round,
        stats: {
          fundingReceived: parseFloat(DummyData.fundingReceived),
          uniqueContributors: DummyData.uniqueContributors,
          avgContribution: parseFloat(DummyData.avgContribution),
          totalContributions: DummyData.totalContributions,
        },
      });

      allTimeStats.fundingReceived += parseFloat(DummyData.fundingReceived);
      allTimeStats.uniqueContributors += parseFloat(
        DummyData.uniqueContributors
      );
    });

    allTimeStats.roundsLength = details.length;

    return {
      projectID: params.id!,
      details,
      allTimeStats,
    };
  });

  const section = (description: any, container: any) => (
    <div className="grid grid-cols-7 gap-8 border-b border-gitcoin-grey-100 pt-10 pb-10 justify-between">
      <div className="col-span-2">{description}</div>
      <div className="col-span-4 flex">{container}</div>
      <div className="col-span-1" />
    </div>
  );

  const renderRoundStats = () => (
    <>
      {section(
        <RoundDetailsCard
          data={{
            round: null,
            heading: "All-Time",
          }}
        />,
        <>
          <StatCard
            heading="Est. Funding Received"
            value={`$${props.allTimeStats.fundingReceived.toFixed(2)}`}
            bg="gitcoin-violet-100"
          />
          <StatCard
            heading="Unique Contributors"
            value={props.allTimeStats.uniqueContributors}
            bg="gitcoin-violet-100"
          />
          <StatCard
            heading="Rounds Participated"
            value={props.allTimeStats.roundsLength}
            bg="gitcoin-violet-100"
          />
        </>
      )}

      {props.details.map((detail) =>
        section(
          <RoundDetailsCard
            data={{ round: detail.round, heading: detail.round?.programName }}
          />,
          <>
            <StatCard
              heading="Est. Funding Received"
              value={`$${detail.stats.fundingReceived.toFixed(2)}`}
              border
            />
            <StatCard
              heading="Unique Contributors"
              value={detail.stats.uniqueContributors}
              border
            />
            <StatCard
              heading="Avg. Contribution"
              value={`$${detail.stats.avgContribution.toFixed(2)}`}
              border
            />
            <StatCard
              heading="No. of Contributions"
              value={detail.stats.totalContributions}
              border
            />
          </>
        )
      )}
    </>
  );

  return <div className="flex-1 flex-col">{renderRoundStats()}</div>;
}
