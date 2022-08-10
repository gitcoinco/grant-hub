import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { fetchProjectById } from "../services/graphqlClient";
import PinataClient from "../services/pinata";
import { LocalStorage } from "../services/Storage";
import { Metadata, ProjectRegistryMetadata } from "../types";

const getProjectById = async (
  client: ApolloClient<NormalizedCacheObject>,
  projectId: number
): Promise<ProjectRegistryMetadata> => {
  const res = await fetchProjectById(client, projectId);

  if (!res) {
    console.log("DASA project not found", res);
    throw new Error("Project not found");
  }

  const project: ProjectRegistryMetadata = {
    metadata: {
      protocol: Number(res.project.metaPtr.protocol),
      pointer: res.project.metaPtr.pointer,
    },
  };

  return project;
};

const getMetadata = async (
  projectId: number,
  project: any,
  cacheKey: string,
  bypassCache: boolean = false
) => {
  const storage = new LocalStorage();
  let metadata: Metadata;

  if (!bypassCache && storage.supported) {
    const item = storage.get(cacheKey);
    if (item !== null) {
      try {
        metadata = JSON.parse(item);
        const ret = {
          ...metadata,
          protocol: project.metadata.protocol,
          pointer: project.metadata.pointer,
          id: projectId,
        };
        storage.add(cacheKey, JSON.stringify(ret));
        return ret;
      } catch (e) {
        // FIXME: dispatch error
        console.log("error parsing cached project metadata", e);
      }
    }
  }

  // if not cached in localstorage
  let content;
  try {
    // FIXME: fetch from pinata gateway
    const pinataClient = new PinataClient();
    content = await pinataClient.fetchText(project.metadata.pointer);
  } catch (e) {
    // FIXME: dispatch "ipfs error"
    console.error(e);
    return null;
  }
  try {
    metadata = JSON.parse(content);
  } catch (e) {
    // FIXME: dispatch JSON error
    console.error(e);
    return null;
  }
  const ret = {
    ...metadata,
    protocol: project.metadata.protocol,
    pointer: project.metadata.pointer,
    id: projectId,
  };
  storage.add(cacheKey, JSON.stringify(ret));
  return ret;
};

const fetchGrantData = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: number,
  bypassCache: boolean = false
): Promise<Metadata | null> => {
  let project: ProjectRegistryMetadata;

  try {
    project = await getProjectById(client, id);
  } catch (e) {
    console.error("DASA error fetching project by id", e);
    return null;
  }

  if (!project.metadata.protocol) {
    console.error("DASA project not found");
    return null;
  }

  const cacheKey = `project-${id}-${project.metadata.protocol}-${project.metadata.pointer}`;
  const item = await getMetadata(id, project, cacheKey, bypassCache);

  if (item === null) {
    console.log("DASA item is null");
    return null;
  }

  return item;
};

export default fetchGrantData;
