import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProjectApplications } from "../../actions/projects";
import { RootState } from "../../reducers";
import { FormInputs, Metadata, Project } from "../../types";
import ProjectDetailsHeader from "../ProjectDetailsHeader";
import About from "./About";
import Rounds from "./rounds/Rounds";
import Stats from "./stats/Stats";
import colors from "../../styles/colors";
import { CredentialProvider, FormInputs, Metadata, Project } from "../../types";
import Calendar from "../icons/Calendar";
import LinkIcon from "../icons/LinkIcon";
import Shield from "../icons/Shield";
import ApplicationCard from "./ApplicationCard";
import markdown from "../../utils/markdown";

function Verified() {
  return (
    <div className="flex rounded bg-green-text/25 px-2 py-0.5 mt-1">
      <Shield dimension={16} color={colors["green-text"]} />{" "}
      <p className="pl-2 text-green-text text-xs font-bold">Verified</p>
    </div>
  );
}

export default function Details({
  project,
  createdAt,
  updatedAt,
  bannerImg,
  logoImg,
  showApplications,
}: {
  project?: Metadata | FormInputs | Project;
  updatedAt: string;
  createdAt: string;
  bannerImg: string | Blob;
  logoImg: string | Blob;
  showApplications: boolean;
}) {
  const params = useParams();
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => {
    const { chainId } = params;

    const applications = state.projects.applications[params.id!] || [];

    return {
      chainId,
      projectID: params.id!,
      applications,
    };
  });

  useEffect(() => {
    if (props.projectID) {
      dispatch(
        fetchProjectApplications(
          props.projectID,
          Number(props.chainId),
          process.env
        )
      );
    }
  }, [dispatch, props.projectID, props.chainId]);

  return (
    <>
      <ProjectDetailsHeader
        title={project?.title ?? ""}
        bannerImg={bannerImg}
        logoImg={logoImg}
      />
      <Tabs className="mt-8" defaultIndex={0}>
        <TabList className="mb-12">
          <Tab _focus={{ boxShadow: "none" }}>About</Tab>
          <Tab _focus={{ boxShadow: "none" }}>Stats</Tab>
          <Tab _focus={{ boxShadow: "none" }}>Rounds</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <About
              project={project}
              showApplications={showApplications}
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
          </TabPanel>
          <TabPanel>
            <Stats />
          </TabPanel>
          <TabPanel>
            <Rounds />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
