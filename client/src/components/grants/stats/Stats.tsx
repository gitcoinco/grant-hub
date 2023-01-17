import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadProjectStats } from "../../../actions/projects";
import { RootState } from "../../../reducers";
import LoadingSpinner from "../../base/LoadingSpinner";
import RoundDetailsCard from "./RoundDetailsCard";
import StatCard from "./StatCard";

export default function RoundStats() {
  const dispatch = useDispatch();
  const params = useParams();
  const props = useSelector((state: RootState) => {
    const details: any[] = [];

    const stats = state.projects?.stats[params.id!]?.roundStats;

    const allTimeStats = {
      fundingReceived: state.projects?.stats[params.id!]?.allTimeReceived || 0,
      uniqueContributors:
        state.projects?.stats[params.id!]?.allTimeUniqueContributors || 0,
      roundsLength: stats?.length || 0,
    };

    if (stats) {
      stats.forEach((stat) => {
        details.push({
          round: state.rounds[stat.roundId].round,
          stats: {
            fundingReceived: stat.fundingReceived,
            uniqueContributors: stat.uniqueContributors,
            avgContribution: stat.avgContribution,
            totalContributions: stat.totalContributions,
          },
        });
      });
    }

    return {
      projectID: params.id!,
      details,
      allTimeStats,
      projectApplications: state.projects.applications[params.id!],
    };
  });

  useEffect(() => {
    console.log(props);
    if (props.projectApplications?.length > 0) {
      const applications =
        props.projectApplications?.filter((app) => app.status === "APPROVED") ||
        [];

      const rounds: Array<{ roundId: string; chainId: number }> = [];
      applications.forEach((app) => {
        rounds.push({
          roundId: app.roundID,
          chainId: app.chainId,
        });
      });
      dispatch(loadProjectStats(params.id!, rounds));
    }
  }, [props.projectApplications]);

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
        <RoundDetailsCard heading="All-Time" />,
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
            round={detail.round}
            heading={detail.round?.programName}
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

  if (props.projectApplications?.length > 0 && props.details?.length === 0)
    return (
      <div className="flex-1 flex-col">
        <LoadingSpinner
          label="Loading Project Stats"
          size="24"
          thickness="6px"
          showText
        />
      </div>
    );

  if (props.details?.length === 0) return <div>nothing to see here</div>;

  return <div className="flex-1 flex-col">{renderRoundStats()}</div>;
}
