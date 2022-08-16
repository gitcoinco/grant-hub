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
  roadmap: string;
  challenges: string;
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
  metaPtr: {
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
};

export interface ProjectEvent {
  id: number;
  block: number;
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
  publicKey: JWK;
  applicationSchema: RoundApplicationQuestion[];
  projectQuestionId?: number;
  recipientQuestionId?: number;
}

export interface Round {
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
}

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
    answer: string;
  }>;
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

/**
 * Supported EVM networks
 */
export type Network = "goerli" | "optimism" | "optimism-kovan";

export interface Web3Instance {
  /**
   * Currently selected address in ETH format i.e 0x...
   */
  address: string;
  /**
   * Chain ID & name of the currently connected network
   */
  chain: {
    id: number;
    name: string;
    network: Network;
  };
}
