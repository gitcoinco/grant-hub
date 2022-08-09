import {
  METADATA_SAVED,
  CREDENTIALS_SAVED,
  ProjectFormActions,
} from "../actions/projectForm";
import { ProjectCredentials } from "../types";

export interface ProjectFormState {
  metadata?: any;
  credentials?: ProjectCredentials;
}

export const initialState: ProjectFormState = {
  metadata: null,
  credentials: {},
};

export const projectFormReducer = (
  state: ProjectFormState = initialState,
  action: ProjectFormActions
) => {
  switch (action.type) {
    case METADATA_SAVED: {
      return {
        ...state,
        metadata: action.metadata,
      };
    }
    case CREDENTIALS_SAVED: {
      return {
        ...state,
        credentials: action.credentials,
      };
    }
    default: {
      return state;
    }
  }
};
