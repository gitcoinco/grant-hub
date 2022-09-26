import { VerifiableCredential } from "@gitcoinco/passport-sdk-types";

export type Images = {
  bannerImg?: Blob;
  logoImg?: Blob;
};

export interface Metadata {
  protocol: number;
  pointer: string;
  id: number;
  title: string;
  description: string;
  website: string;
  bannerImg?: string;
  logoImg?: string;
  userGithub?: string;
  projectGithub?: string;
  projectTwitter?: string;
  credentials?: ProjectCredentials;
}

export interface Project {
  lastUpdated: Number; // unix timestamp in milliseconds
  id: string;
  title: string;
  description: string;
  website: string;
  bannerImg?: string;
  logoImg?: string;
  metaPtr: MetaPtr;
  userGithub?: string;
  projectGithub?: string;
  projectTwitter?: string;
  credentials?: ProjectCredentials;
}

export type ProjectRegistryMetadata = {
  metadata: {
    protocol: number;
    pointer: string;
  };
};

export type ChangeHandlers =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

// Inputs
export type InputProps = {
  label: string;
  name: string;
  info?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  changeHandler: (event: ChangeHandlers) => void;
  required: boolean;
  isValid: boolean;
};

export type AddressInputProps = {
  label: string;
  name: string;
  info?: string;
  tooltipValue?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  changeHandler: (event: ChangeHandlers) => void;
  required: boolean;
  isValid: boolean;
};

export interface ProjectEvent {
  id: number;
  block: number;
  createdAtBlock?: number;
}

export interface MetaPtr {
  protocol: string;
  pointer: string;
}

export interface RoundMetadata {
  name: string;
}

export interface RoundApplicationQuestion {
  id: number;
  question: string;
  type: string;
  required: boolean;
  info?: string;
  choices?: string[];
  encrypted?: boolean;
}

export interface JWK {
  alg: string;
  e: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  n: string;
}

export interface RoundApplicationMetadata {
  lastUpdatedOn: number;
  applicationSchema: RoundApplicationQuestion[];
  application_schema: RoundApplicationQuestion[];
  projectQuestionId?: number;
  recipientQuestionId?: number;
}

export type Round = {
  address: string;
  applicationsStartTime: number;
  applicationsEndTime: number;
  roundStartTime: number;
  roundEndTime: number;
  token: string;
  roundMetaPtr: MetaPtr;
  roundMetadata: RoundMetadata;
  applicationMetaPtr: MetaPtr;
  applicationMetadata: RoundApplicationMetadata;
};

export type ProjectOption = {
  id: number | undefined;
  title?: string;
};

export interface RoundApplication {
  /**
   * The round contract address applied to
   */
  round: string;
  /**
   * Recipient wallet address of grantee
   */
  recipient: string;
  /**
   * Project information
   */
  project: Project;

  /** List of answers to questions */
  answers: Array<{
    questionId: Number;
    question: string;
    answer: string | undefined;
    encryptedAnswer:
      | {
          ciphertext: string;
          encryptedSymmetricKey: string;
        }
      | undefined;
  }>;
}

export interface SignedRoundApplication {
  signature: string;
  application: RoundApplication;
}

export type ProviderID = "ClearTextTwitter" | "ClearTextGithubOrg";

export type ProjectCredentials = {
  github?: VerifiableCredential;
  twitter?: VerifiableCredential;
};

export type FormInputs = {
  title?: string;
  description?: string;
  website?: string;
  projectTwitter?: string;
  userGithub?: string;
  projectGithub?: string;
  bannerImg?: Blob;
  logoImg?: Blob;
  credentials?: ProjectCredentials;
};

export enum ProjectFormStatus {
  Metadata,
  Verification,
  Preview,
}

export type DynamicFormInputs = {
  [key: string]: string;
};
