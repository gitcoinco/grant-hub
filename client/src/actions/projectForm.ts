import { FormInputs } from "../types";

export const METADATA_SAVED = "METADATA_SAVED";
export const CREDENTIALS_SAVED = "CREDENTIALS_SAVED";

export interface MetadataSaved {
  type: typeof METADATA_SAVED;
  metadata: FormInputs;
}

export interface CredentialsSaved {
  type: typeof CREDENTIALS_SAVED;
  credentials: string;
}

export type ProjectFormActions = MetadataSaved | CredentialsSaved;

export const metadataUpdated = ({
  title,
  description,
  website,
  bannerImg,
  logoImg,
}: FormInputs): ProjectFormActions => ({
  type: METADATA_SAVED,
  metadata: {
    title,
    description,
    website,
    bannerImg,
    logoImg,
  },
});
