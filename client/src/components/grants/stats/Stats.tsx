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
  const [noStats, setNoStats] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const props = useSelector((state: RootState) => {
    const details: any[] = [];
    const stats: ProjectStats[] = state.projects?.stats[params.id!];

    let allTime = {
      allTimeReceived: 0,
      allTimeContributions: 0,
      roundsLength: 0,
    };
    if (stats?.length > 0) {
      stats.forEach((stat) => {
        allTime = {
          allTimeReceived: allTime.allTimeReceived + stat.fundingReceived,
          allTimeContributions:
            allTime.allTimeContributions + stat.totalContributions,
          roundsLength: stats.length,
        };
        details.push({
          round: state.rounds[stat.roundId].round,
          stats: { ...stat },
        });
      });
    }

    return {
      projectID: params.id!,
      allTime,
      details,
      projectApplications: state.projects.applications[params.id!],
    };
  });

  useEffect(() => {
    if (props.projectApplications?.length > 0) {
      setNoStats(false);
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
    } else {
      setNoStats(true);
    }
  }, [props.projectApplications]);

  const section = (description: any, container: any) => (
    <div className="grid md:grid-cols-7 sm:grid-cols-1 gap-8 border-b border-gitcoin-grey-100 pt-10 pb-10 justify-between">
      <div className="md:col-span-2 sm:col-span-1">{description}</div>
      <div className="md:col-span-4 sm:col-span-1 flex">{container}</div>
      <div className="md:col-span-1 sm:col-span-1" />
    </div>
  );

  const renderRoundStats = () => (
    <>
      {section(
        <RoundDetailsCard heading="All-Time" />,
        <>
          <StatCard
            heading="Est. Funding Received"
            value={`$${props.allTime.allTimeReceived.toFixed(2)}`}
            bg="gitcoin-violet-100"
            tooltip="The estimated funding received by this project."
          />
          <StatCard
            heading="No. of Contributions"
            value={props.allTime.allTimeContributions}
            bg="gitcoin-violet-100"
            tooltip="The number of contributions this project has received."
          />
          <StatCard
            heading="Rounds Participated"
            value={props.allTime.roundsLength}
            bg="gitcoin-violet-100"
            tooltip="The number of rounds this project has participated in."
          />
        </>
      )}

      {props.details.map((detail) =>
        section(
          <RoundDetailsCard
            heading={detail.round?.programName}
            round={detail.round}
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

  if (noStats)
    return (
      <div className="text-base text-gitcoin-grey-400 flex items-center justify-center p-10">
        No stats available yet for this project.
      </div>
    );

  if (
    props.details?.length === 0 ||
    props.details?.length !== props.allTime.roundsLength
  )
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

  return <div className="flex-1 flex-col pb-20">{renderRoundStats()}</div>;
}
