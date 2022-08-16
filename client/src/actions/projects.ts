import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  BaseProject,
  fetchProjectsByAccountAddress,
} from "../services/graphqlClient";
import { fetchGrantData } from "./grantsMetadata";

const loadProjects = async (
  client: ApolloClient<NormalizedCacheObject>,
  address: string,
  withMetadata: boolean = false
): Promise<BaseProject[]> => {
  const projectResponse = await fetchProjectsByAccountAddress(client, address);

  if (!projectResponse) {
    return [];
  }

  if (withMetadata) {
    const projects = await Promise.all(
      projectResponse.projects.map(async (project) => {
        const metadata = await fetchGrantData(client, Number(project.id));

        return metadata ? { ...project, metadata } : project;
      })
    );
    return projects;
  }

  return projectResponse.projects;
};

export default loadProjects;
