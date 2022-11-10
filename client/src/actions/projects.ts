import { datadogRum } from "@datadog/browser-rum";
import { BigNumber, ethers } from "ethers";
import { Dispatch } from "redux";
import { addressesByChainID } from "../contracts/deployments";
import { global } from "../global";
import { RootState } from "../reducers";
import PinataClient from "../services/pinata";
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

export type ProjectsActions =
  | ProjectsLoadingAction
  | ProjectsLoadedAction
  | ProjectsUnloadedAction
  | ProjectApplicationsLoadingAction
  | ProjectApplicationsNotFoundAction
  | ProjectApplicationsLoadedAction
  | ProjectApplicationsErrorAction;

const projectsLoading = () => ({
  type: PROJECTS_LOADING,
});

const projectsLoaded = (events: ProjectEventsMap) => ({
  type: PROJECTS_LOADED,
  events,
});

const projectsUnload = () => ({
  type: PROJECTS_UNLOADED,
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

export const loadProjects =
  (withMetaData?: boolean) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(projectsLoading());

    const state = getState();
    const { chainID, account } = state.web3;

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
            status
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
        error,
      });
    }
  };

export const updateApplicationStatusFromContract =
  (applications: any[], projectsMetaPtr: any, filterByStatus?: string) =>
  //  eslint-disable-next-line @typescript-eslint/no-unused-vars
  (dispatch: Dispatch) => {
    // Handle scenario where operator hasn't review any projects in the round
    if (!projectsMetaPtr)
      return filterByStatus
        ? applications.filter(
            (application) => application.status === filterByStatus
          )
        : applications;

    const pinataClient = new PinataClient();
    const applicationsFromContract = Promise.resolve(
      pinataClient.fetchText(projectsMetaPtr)
    );
    applicationsFromContract.then((appsFromContract) => {
      console.log("applicationsFromContract", applicationsFromContract);
      // todo: take action here to update the status of the applications
      const applicationsParsed: [] = JSON.parse(appsFromContract);
      console.log("applicationsParsed", applicationsParsed);
      // Iterate over all applications indexed by graph
      // applicationsParsed.map((application: any) => {
      //   try {
      //     console.log("application", application);
      //     // fetch matching application index from contract
      //     // const index = applicationsFromContract.findIndex(
      //     //   (applicationFromContract: any) =>
      //     //     application.id === applicationFromContract.id
      //     // );
      //     // update status of application from contract / default to pending
      //     // todo: should I dispatch and action here to update status?
      //     // const appStatus =
      //     //   index >= 0 ? applicationsFromContract[index].status : "PENDING";
      //     // application.status = appStatus;
      //   } catch {
      //     // todo: also here should I dispatch an action to update status?
      //     // application.status = "PENDING";
      //   }
      //   return application;
      // });
    });

    if (filterByStatus) {
      return applications.filter(
        (application) => application.status === filterByStatus
      );
    }

    return applications;
  };

export const unloadProjects = () => projectsUnload();
