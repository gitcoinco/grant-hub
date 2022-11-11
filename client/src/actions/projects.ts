import { datadogRum } from "@datadog/browser-rum";
import { BigNumber, ethers } from "ethers";
import { Dispatch } from "redux";
import { addressesByChainID } from "../contracts/deployments";
import { global } from "../global";
import { RootState } from "../reducers";
import { ProjectEventsMap } from "../types";
import { ChainId, graphqlFetch } from "../utils/graphql";
import { fetchGrantData } from "./grantsMetadata";

export const PROJECTS_LOADING = "PROJECTS_LOADING";
interface ProjectsLoadingAction {
  type: typeof PROJECTS_LOADING;
}

export const PROJECTS_LOADED = "PROJECTS_LOADED";
interface ProjectsLoadedAction {
  type: typeof PROJECTS_LOADED;
  events: ProjectEventsMap;
}

export const PROJECTS_ERROR = "PROJECTS_ERROR";
interface ProjectsErrorAction {
  type: typeof PROJECTS_ERROR;
  error: string;
}

export const PROJECTS_UNLOADED = "PROJECTS_UNLOADED";
export interface ProjectsUnloadedAction {
  type: typeof PROJECTS_UNLOADED;
}

export const PROJECT_APPLICATIONS_LOADING = "PROJECT_APPLICATIONS_LOADING";
interface ProjectApplicationsLoadingAction {
  type: typeof PROJECT_APPLICATIONS_LOADING;
}

export const PROJECT_APPLICATIONS_NOT_FOUND = "PROJECT_APPLICATIONS_NOT_FOUND";
interface ProjectApplicationsNotFoundAction {
  type: typeof PROJECT_APPLICATIONS_NOT_FOUND;
  projectID: string;
  roundID: string;
}

export const PROJECT_APPLICATIONS_LOADED = "PROJECT_APPLICATIONS_LOADED";
interface ProjectApplicationsLoadedAction {
  type: typeof PROJECT_APPLICATIONS_LOADED;
  projectID: string;
  applications: any;
}

export const PROJECT_APPLICATIONS_ERROR = "PROJECT_APPLICATIONS_ERROR";
interface ProjectApplicationsErrorAction {
  type: typeof PROJECT_APPLICATIONS_ERROR;
  projectID: string;
  error: string;
}

export const PROJECT_STATUS_LOADING = "PROJECT_STATUS_LOADING";
interface ProjectStatusLoadingAction {
  type: typeof PROJECT_STATUS_LOADING;
  projectID: string;
}

export const PROJECT_STATUS_LOADED = "PROJECT_STATUS_LOADED";
interface ProjectStatusLoadedAction {
  type: typeof PROJECT_STATUS_LOADED;
  projectID: string;
  applicationStatus: any;
  status: string;
}

export const PROJECT_STATUS_ERROR = "PROJECT_STATUS_ERROR";
interface ProjectStatusErrorAction {
  type: typeof PROJECT_STATUS_ERROR;
  projectID: string;
  error: string;
}

export type ProjectsActions =
  | ProjectsLoadingAction
  | ProjectsLoadedAction
  | ProjectsErrorAction
  | ProjectsUnloadedAction
  | ProjectApplicationsLoadingAction
  | ProjectApplicationsNotFoundAction
  | ProjectApplicationsLoadedAction
  | ProjectApplicationsErrorAction
  | ProjectStatusLoadingAction
  | ProjectStatusLoadedAction
  | ProjectStatusErrorAction;

const projectsLoading = () => ({
  type: PROJECTS_LOADING,
});

const projectsLoaded = (events: ProjectEventsMap) => ({
  type: PROJECTS_LOADED,
  events,
});

const projectError = (error: string) => ({
  type: PROJECTS_ERROR,
  error,
});

const projectsUnload = () => ({
  type: PROJECTS_UNLOADED,
});

const projectStatusLoading = () => ({
  type: PROJECT_STATUS_LOADING,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const projectStatusLoaded = (projectID: string, status: string) => ({
  type: PROJECT_STATUS_LOADED,
  projectID,
  status,
});

const projectStatusError = (projectID: string, error: any) => ({
  type: PROJECT_STATUS_ERROR,
  projectID,
  error,
});

const fetchProjectCreatedEvents = async (chainID: number, account: string) => {
  const addresses = addressesByChainID(chainID!);
  // FIXME: use contract filters when fantom bug is fixed
  // const contract = new ethers.Contract(
  //   addresses.projectRegistry,
  //   ProjectRegistryABI,
  //   global.web3Provider!
  // );

  // FIXME: use this line when the fantom RPC bug has been fixed
  // const createdFilter = contract.filters.ProjectCreated(null, account) as any;
  const createdEventSig = ethers.utils.id("ProjectCreated(uint256,address)");
  const createdFilter = {
    address: addresses.projectRegistry,
    fromBlock: "0x00",
    toBlock: "latest",
    topics: [createdEventSig, null, ethers.utils.hexZeroPad(account, 32)],
  };

  // FIXME: remove when the fantom RPC bug has been fixed
  if (chainID === 250 || chainID === 4002) {
    createdFilter.address = undefined;
  }

  // FIXME: use queryFilter when the fantom RPC bug has been fixed
  // const createdEvents = await contract.queryFilter(createdFilter);
  let createdEvents = await global.web3Provider!.getLogs(createdFilter);

  // FIXME: remove when the fantom RPC bug has been fixed
  createdEvents = createdEvents.filter(
    (e) => e.address === addresses.projectRegistry
  );

  if (createdEvents.length === 0) {
    return {
      createdEvents: [],
      updatedEvents: [],
      ids: [],
    };
  }

  // FIXME: use this line when the fantom RPC bug has been fixed
  // const ids = createdEvents.map((event) => event.args!.projectID!.toNumber());
  const ids = createdEvents.map((event) => parseInt(event.topics[1], 16));

  // FIXME: use this line when the fantom RPC bug has been fixed
  // const hexIDs = createdEvents.map((event) =>
  //   event.args!.projectID!.toHexString()
  // );
  const hexIDs = createdEvents.map((event) => event.topics[1]);

  // FIXME: use this after fantom bug is fixed
  // const updatedFilter = contract.filters.MetadataUpdated(hexIDs);
  // const updatedEvents = await contract.queryFilter(updatedFilter);

  // FIXME: remove when fantom bug is fixed
  const updatedEventSig = ethers.utils.id(
    "MetadataUpdated(uint256,(uint256,string))"
  );
  const updatedFilter = {
    address: addresses.projectRegistry,
    fromBlock: "0x00",
    toBlock: "latest",
    topics: [updatedEventSig, hexIDs],
  };

  // FIXME: remove when the fantom RPC bug has been fixed
  if (chainID === 250 || chainID === 4002) {
    updatedFilter.address = undefined;
  }

  let updatedEvents = await global.web3Provider!.getLogs(updatedFilter);
  console.log(updatedEventSig);
  console.log(updatedFilter);
  // FIXME: remove when the fantom RPC bug has been fixed
  updatedEvents = updatedEvents.filter(
    (e) => e.address === addresses.projectRegistry
  );

  return {
    createdEvents,
    updatedEvents,
    ids,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchProjectsMetadataUpdatedEvents =
  (account: string, projectId: string, roundId: string) =>
  async (dispatch: Dispatch) => {
    console.log("roundId", roundId);
    dispatch(projectStatusLoading());
    try {
      // todo: fetch all projects for current owner and get the status
      const abi = [
        "event ProjectsMataPtrUpdated(MetaPtr oldMetaPtr, MetaPtr newMetaPtr)",
      ];

      // todo: get the round address
      const contract = new ethers.Contract(
        "0xbD81499fD6c579271DB45d3445569D1d7E96080C",
        abi,
        global.web3Provider!
      );

      console.log("contract", contract);

      const events = contract.filters.ProjectsMataPtrUpdated();

      console.log("events", events);

      const statusEventSig = ethers.utils.id(
        "ProjectsMataPtrUpdated(MetaPtr,MetaPtr)"
      );
      console.log("statusEventSig", statusEventSig);
      const createdFilter = {
        address: "0xDda2a1827Ca45A0ce010B57D574A607Dbd21bE6E",
        fromBlock: "0x00",
        toBlock: "latest",
        topics: [statusEventSig, ethers.utils.hexZeroPad(account, 32)],
      };
      // FIXME: remove when the fantom RPC bug has been fixed
      // if (chainID === 250 || chainID === 4002) {
      //   createdFilter.address = undefined;
      // }

      // FIXME: use queryFilter when the fantom RPC bug has been fixed
      // const createdEvents = await contract.queryFilter(createdFilter);
      let createdEvents = await global.web3Provider!.getLogs(createdFilter);
      console.log("statusEventSig", statusEventSig);
      console.log("createdFilter", createdFilter);
      // FIXME: remove when the fantom RPC bug has been fixed
      createdEvents = createdEvents.filter(
        (e) => e.address === "0xDda2a1827Ca45A0ce010B57D574A607Dbd21bE6E"
      );

      console.log("******* createdEvents *******", createdEvents);

      // if (createdEvents.length === 0) {
      //   return {
      //     createdEvents: [],
      //   };
      // }

      // return {
      //   createdEvents,
      // };
    } catch (error) {
      console.error("error from fetching status metadata", error);
      dispatch(projectStatusError(projectId, error));
    }

    return {
      createdEvents: [],
    };
  };

export const loadProjects =
  (withMetaData?: boolean) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(projectsLoading());

    const state = getState();
    const { chainID, account } = state.web3;

    try {
      const { createdEvents, updatedEvents, ids } =
        await fetchProjectCreatedEvents(chainID!, account!);

      if (createdEvents.length === 0) {
        dispatch(projectsLoaded({}));
        return;
      }

      const events: ProjectEventsMap = {};

      createdEvents.forEach((createEvent) => {
        // FIXME: use this line when the fantom RPC bug has been fixed
        // const id = createEvent.args!.projectID!;
        const id = parseInt(createEvent.topics[1], 16);
        events[id] = {
          createdAtBlock: createEvent.blockNumber,
          updatedAtBlock: undefined,
        };
      });

      updatedEvents.forEach((updateEvent) => {
        // FIXME: use this line when the fantom RPC bug has been fixed
        // const id = BigNumber.from(updateEvent.args!.projectID!).toNumber();
        const id = BigNumber.from(updateEvent.topics[1]).toNumber();
        const event = events[id];
        if (event !== undefined) {
          event.updatedAtBlock = updateEvent.blockNumber;
        }
      });

      if (withMetaData) {
        ids.map((id) => dispatch<any>(fetchGrantData(id)));
      }

      dispatch(projectsLoaded(events));
    } catch (error) {
      dispatch(projectError("Cannot load projects"));
    }
  };

export const getRoundProjectsApplied =
  (projectID: string, chainId: ChainId) => async (dispatch: Dispatch) => {
    dispatch({
      type: PROJECT_APPLICATIONS_LOADING,
      projectID,
    });

    try {
      console.log("fetching graphql project data");
      const applicationsFound: any = await graphqlFetch(
        `query roundProjects($projectID: String) {
          roundProjects(where: { project: $projectID }) {
            round {
              id
            }
          }
        }
        `,
        chainId,
        { projectID }
      );
      const applications = applicationsFound.data.roundProjects;

      dispatch({
        type: PROJECT_APPLICATIONS_LOADED,
        projectID,
        applications,
      });

      if (applications) {
        console.log("applications", applications);
        // dispatch<any>(updateApplicationStatusFromContract(applications, projectsMetaPtr));
      }
    } catch (error: any) {
      datadogRum.addError(error, { projectID });
      dispatch({
        type: PROJECT_APPLICATIONS_ERROR,
        projectID,
        error: error.message,
      });
    }
  };

export const unloadProjects = () => projectsUnload();
