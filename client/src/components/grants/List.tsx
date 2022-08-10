import { useEffect, useState } from "react";
import { useDatadogRum } from "react-datadog";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { newGrantPath, slugs } from "../../routes";
import colors from "../../styles/colors";
import Button, { ButtonVariants } from "../base/Button";
import Globe from "../icons/Globe";
import Card from "./Card";

import { getRoundMetadata } from "../../actions/rounds";
import { useClients } from "../../hooks/useDataClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  fetchProjectsByAccountAddress,
  ProjectsResponse,
  RoundResponse,
  useFetchedSubgraphStatus,
  useFetchRoundByAddress,
} from "../../services/graphqlClient";
import CallbackModal from "../base/CallbackModal";

function ProjectsList() {
  const [loading, setLoading] = useState(true);
  const [projectsQueryResult, setProjectsQueryResult] =
    useState<ProjectsResponse>();
  const dataDog = useDatadogRum();
  const navigate = useNavigate();
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [roundToApply] = useLocalStorage("roundToApply", null);
  const [roundInfo, setRoundInfo] = useState<RoundResponse | null>(null);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { grantHubClient, roundManagerClient } = useClients();

  useEffect(() => {
    console.log("DASA grantHubClient", grantHubClient);
  }, [grantHubClient]);

  const subgraphStatus = useFetchedSubgraphStatus();

  async function fetchProjectsFromGraph() {
    const result = await fetchProjectsByAccountAddress(
      grantHubClient!,
      address!
    );

    console.log("projectsQueryResult", result);
    if (result) {
      setProjectsQueryResult(result!);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("DASA 1", grantHubClient, address);
    if (grantHubClient && address) {
      console.log("DASA 2");
      fetchProjectsFromGraph();
    }
  }, [address, chain, grantHubClient]);

  async function fetchRoundInfo() {
    if (roundToApply && roundManagerClient) {
      const fetchedRoundInfo = await useFetchRoundByAddress(
        roundManagerClient,
        roundToApply
      );
      if (fetchedRoundInfo) {
        const metadata = await getRoundMetadata(
          fetchedRoundInfo?.round.roundMetaPtr.pointer
        );
        if (metadata) {
          fetchedRoundInfo.round.metadata = metadata;
        }
        setRoundInfo(fetchedRoundInfo);
      }
    }
  }

  useEffect(() => {
    fetchRoundInfo();
  }, [roundToApply, roundManagerClient]);

  useEffect(() => {
    if (!subgraphStatus.available) {
      console.warn("Subgraph is NOT available!!", subgraphStatus);
      return;
    }
    if (!subgraphStatus.healthy) {
      console.error("Subgraph is NOT healthy!!", subgraphStatus);
      dataDog.addError("Subgraph is NOT healthy!!", subgraphStatus);
      return;
    }
    if (subgraphStatus.syncedBlock !== subgraphStatus.headBlock) {
      // This is most likely fine, but we should record a metric.
      console.info(
        "Subgraph is not fully synced. It is behind by:",
        subgraphStatus.headBlock! - subgraphStatus.syncedBlock!
      );
    }
  }, [subgraphStatus]);

  useEffect(() => {
    if (
      roundToApply !== null &&
      projectsQueryResult &&
      projectsQueryResult.projects.length > 0
    ) {
      setToggleModal(true);
    }
  }, [projectsQueryResult?.projects.length, roundToApply]);

  return (
    <div className="flex flex-col flex-grow h-full mx-4 sm:mx-0">
      {loading && <>loading...</>}

      {!loading && (
        <>
          <div className="flex flex-col mt-4 mb-4">
            <h3>My Projects</h3>
            <p className="text-base">
              Manage projects across multiple grants programs.
            </p>
          </div>
          <div className="grow">
            {projectsQueryResult?.projects.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {projectsQueryResult.projects.map((project) => (
                  <Card projectId={Number(project.id)} key={project.id} />
                ))}
              </div>
            ) : (
              <div className="flex h-full justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10">
                    <Globe color={colors["primary-background"]} />
                  </div>
                  <h4 className="mt-6">No projects</h4>
                  <p className="text-xs mt-6">
                    It looks like you haven&apos;t created any projects yet.
                  </p>
                  <p className="text-xs">Learn More</p>
                  <Link to={newGrantPath()} className="mt-6">
                    <Button variant={ButtonVariants.outline}>
                      Create a Project
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <CallbackModal
        modalOpen={toggleModal}
        confirmText="Apply to Grant Round"
        confirmHandler={() => {
          navigate(slugs.roundApplication.replace(":id", roundToApply));
        }}
        headerImageUri="https://via.placeholder.com/380"
        toggleModal={setToggleModal}
      >
        <>
          <h5 className="font-semibold mb-2 text-2xl">
            Time to get your project funded!
          </h5>
          <p className="mb-4 ">
            Congratulations on creating your project on Grant Hub! Continue to
            apply for{" "}
            {roundInfo === null || roundInfo.round.metadata === null
              ? "the round"
              : roundInfo.round.metadata?.name}
          </p>
        </>
      </CallbackModal>
    </div>
  );
}

export default ProjectsList;
