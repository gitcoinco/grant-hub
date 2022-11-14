import "@testing-library/jest-dom";
import {
  AppStatus,
  projectsReducer,
  ProjectsState,
  Status,
} from "../../reducers/projects";

describe("projects reducer", () => {
  let state: ProjectsState;

  beforeEach(() => {
    state = {
      status: Status.Undefined,
      error: undefined,
      ids: [],
      events: {},
      applications: [],
      applicationsLoading: Status.Undefined,
      applicationsLoadingStatus: Status.Undefined,
    };
  });

  it("PROJECT_APPLICATIONS_LOADING updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_APPLICATIONS_LOADING",
    });

    expect(newState.applicationsLoading).toBe(Status.Loading);
  });

  it("PROJECT_APPLICATIONS_LOADED updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_APPLICATIONS_LOADED",
      projectID: "12345",
      applications: [],
    });

    expect(newState.applicationsLoading).toBe(Status.Loaded);
  });

  it("PROJECT_APPLICATIONS_NOT_FOUND updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_APPLICATIONS_NOT_FOUND",
      projectID: "12345",
      roundID: "0x1234",
    });

    expect(newState.applicationsLoading).toBe(Status.Loaded);
  });

  it("PROJECT_APPLICATIONS_ERROR updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_APPLICATIONS_ERROR",
      projectID: "12345",
      error: "error",
    });

    expect(newState.applicationsLoading).toBe(Status.Error);
    expect(newState.error).toBe("error");
  });

  it("PROJECT_STATUS_LOADING updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_STATUS_LOADING",
      projectID: "12345",
    });

    expect(newState.applicationsLoadingStatus).toBe(Status.Loading);
  });

  it("PROJECT_STATUS_LOADED updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_STATUS_LOADED",
      applicationStatus: AppStatus.Approved,
      roundID: "0x1234",
    });

    expect(newState.applicationsLoadingStatus).toBe(Status.Loaded);
  });

  it("PROJECT_STATUS_ERROR updates state", async () => {
    const newState: ProjectsState = projectsReducer(state, {
      type: "PROJECT_STATUS_ERROR",
      projectID: "12345",
      error: "error",
    });

    expect(newState.applicationsLoadingStatus).toBe(Status.Error);
    expect(newState.error).toBe("error");
  });
});
