import React, { useEffect, useState } from "react";
import { useDatadogRum } from "react-datadog";
import { Link, useNavigate } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { newGrantPath, slugs } from "../../routes";
import { loadProjects } from "../../actions/projects";
import Globe from "../icons/Globe";
import Button, { ButtonVariants } from "../base/Button";
import Card from "./Card";
import colors from "../../styles/colors";
import { Status } from "../../reducers/projects";
import {
  useFetchedProjects,
  useFetchedSubgraphStatus,
  useFetchRoundByAddress,
} from "../../services/graphqlClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import CallbackModal from "../base/CallbackModal";
import { loadRound } from "../../actions/rounds";

function ProjectsList() {
  const dataDog = useDatadogRum();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [roundToApply] = useLocalStorage("roundToApply", null);
  const roundInfo = useFetchRoundByAddress(roundToApply);

  const props = useSelector(
    (state: RootState) => ({
      loading: state.projects.status === Status.Loading,
      chainID: state.web3.chainID,
      rounds: state.rounds,
    }),
    shallowEqual
  );

  const subgraphStatus = useFetchedSubgraphStatus();
  const projectsQueryResult = useFetchedProjects();

  useEffect(() => {
    if (roundInfo) {
      dispatch(loadRound(roundInfo));
    }
  }, [roundInfo?.round.id]);

  useEffect(() => {
    dispatch(loadProjects());
  }, [dispatch]);

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
      projectsQueryResult.projects.length > 0 &&
      props.rounds[roundToApply]?.round?.roundMetadata.name
    ) {
      setToggleModal(true);
    }
  }, [
    projectsQueryResult?.projects.length,
    roundToApply,
    props.rounds[roundToApply],
  ]);

  return (
    <div className="flex flex-col flex-grow h-full mx-4 sm:mx-0">
      {props.loading && <>loading...</>}

      {!props.loading && (
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
                  <Card
                    projectId={Number(project.id)}
                    metaPtr={project.metaPtr}
                    key={project.id}
                  />
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
            {props.rounds[roundToApply] === undefined
              ? "the round"
              : props.rounds[roundToApply].round?.roundMetadata.name}
          </p>
        </>
      </CallbackModal>
    </div>
  );
}

export default ProjectsList;
