import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadProjectStats } from "../../../actions/projects";
import { RootState } from "../../../reducers";
import { ProjectStats } from "../../../reducers/projects";
import RoundDetailsCard from "./RoundDetailsCard";
import StatCard from "./StatCard";

export default function RoundStats() {
  const [allTime, setAllTime] = useState<any>({
    allTimeReceived: 0,
    allTimeContributions: 0,
    roundsLength: 0,
  });
  const dispatch = useDispatch();
  const params = useParams();
  const props = useSelector((state: RootState) => {
    const details: any[] = [];
    const stats: ProjectStats[] = state.projects?.stats[params.id!];

    console.log("===============>");
    console.log(stats);
    console.log(state.projects);

    if (stats?.length > 0) {
      stats.forEach((stat) => {
        setAllTime({
          allTimeReceived: allTime.allTimeReceived + stat.fundingReceived,
          allTimeContributions:
            allTime.allTimeContributions + stat.totalContributions,
          roundsLength: stats.length,
        });
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
      projectApplications: state.projects.applications[params.id!],
    };
  });

  useEffect(() => {
    console.log(props);
    console.log("ololololol");
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
            value={`$${allTime.fundingReceived.toFixed(2)}`}
            bg="gitcoin-violet-100"
          />
          <StatCard
            heading="No. of Contributions"
            value={allTime.allTimeContributions}
            bg="gitcoin-violet-100"
          />
          <StatCard
            heading="Rounds Participated"
            value={allTime.roundsLength}
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
      <div className="flex items-center justify-center">
        <Spinner
          label="Loading Project Stats"
          className="flex items-center justify-center"
          thickness="6px"
          boxSize={24}
          speed="0.80s"
          emptyColor="gray.200"
          color="purple.500"
        />
      </div>
    );

  if (props.details?.length === 0) return <div>nothing to see here</div>;

  return <div className="flex-1 flex-col">{renderRoundStats()}</div>;
}
