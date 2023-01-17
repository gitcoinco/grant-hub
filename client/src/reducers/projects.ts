import {
  ProjectsActions,
  PROJECTS_ERROR,
  PROJECTS_LOADED,
  PROJECTS_LOADING,
  PROJECTS_UNLOADED,
  PROJECT_APPLICATIONS_ERROR,
  PROJECT_APPLICATIONS_LOADED,
  PROJECT_APPLICATIONS_LOADING,
  PROJECT_APPLICATION_UPDATED,
  PROJECT_STATS_LOADED,
  PROJECT_STATS_LOADING,
} from "../actions/projects";
import { ProjectEventsMap } from "../types";

export enum Status {
  Undefined = 0,
  Loading,
  Loaded,
  Error,
}

export type AppStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "APPEAL"
  | "FRAUD";

export type Application = {
  roundID: string;
  status: AppStatus;
  chainId: number;
};

export type ProjectStats = {
  roundId: string;
  fundingReceived: number;
  uniqueContributors: number;
  avgContribution: number;
  totalContributions: number;
};

export type Stats = {
  allTimeReceived: number;
  allTimeUniqueContributors: number;
  roundStats: ProjectStats[];
};

export interface ProjectsState {
  status: Status;
  error: string | undefined;
  ids: string[];
  events: ProjectEventsMap;
  applications: {
    [projectID: string]: Application[];
  };
  stats: {
    [projectID: string]: Stats;
  };
}

const initialState: ProjectsState = {
  status: Status.Undefined,
  error: undefined,
  ids: [],
  events: {},
  applications: {},
  stats: {},
};

export const projectsReducer = (
  state: ProjectsState = initialState,
  action: ProjectsActions
): ProjectsState => {
  switch (action.type) {
    case PROJECTS_LOADING: {
      return {
        ...state,
        status: Status.Loading,
        ids: [],
      };
    }

    case PROJECTS_LOADED: {
      const { events } = action;
      const ids = Object.keys(events);

      return {
        ...state,
        status: Status.Loaded,
        ids: [...state.ids, ...ids],
        events: { ...state.events, ...events },
      };
    }

    case PROJECTS_ERROR: {
      return {
        ...state,
        status: Status.Error,
        error: action.error,
      };
    }

    case PROJECTS_UNLOADED: {
      return {
        ...state,
        status: Status.Undefined,
        ids: [],
        events: {},
      };
    }

    case PROJECT_APPLICATIONS_LOADING: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.projectID]: [],
        },
        error: undefined,
      };
    }

    case PROJECT_APPLICATIONS_LOADED: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.projectID]: [
            ...(state.applications[action.projectID] ?? []),
            ...action.applications,
          ],
        },
        error: undefined,
      };
    }

    case PROJECT_APPLICATION_UPDATED: {
      const projectApplications = state.applications[action.projectID] || [];
      const index = projectApplications.findIndex(
        (app: Application) => app.roundID === action.roundID
      );

      if (index < 0) {
        return state;
      }

      const updatedApplication = {
        ...projectApplications[index],
        status: action.status,
      };

      return {
        ...state,
        applications: {
          ...state.applications,
          [action.projectID]: [
            ...projectApplications.slice(0, index),
            updatedApplication,
            ...projectApplications.slice(index + 1),
          ],
        },
        error: undefined,
      };
    }

    case PROJECT_APPLICATIONS_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }

    case PROJECT_STATS_LOADING: {
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.projectID]: {
            allTimeReceived: 0,
            allTimeUniqueContributors: 0,
            roundStats: [],
          },
        },
        error: undefined,
      };
    }

    case PROJECT_STATS_LOADED: {
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.projectID]: {
            ...state.stats[action.projectID],
            ...action.stats,
          },
        },
        error: undefined,
      };
    }

    default: {
      return state;
    }
  }
};
