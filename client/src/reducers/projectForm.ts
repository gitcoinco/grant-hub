import {
  METADATA_SAVED,
  CREDENTIALS_SAVED,
  ProjectFormActions,
} from "../actions/projectForm";
import { FormInputs, ProjectCredentials } from "../types";

export interface ProjectFormState {
  metadata?: FormInputs;
  credentials?: ProjectCredentials;
}

export const initialState: ProjectFormState = {
  metadata: undefined,
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
