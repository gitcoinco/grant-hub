export interface Metadata {
  protocol: number;
  pointer: string;
  id: number;
  title: string;
  description: string;
  roadmap: string;
  challenges: string;
  website: string;
  projectImg?: string;
}

// Inputs
export type InputProps = {
  label: string;
  name: string;
  info?: string;
  value?: string | number;
  placeholder?: string;
  changeHandler: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export type RadioInputProps = {
  name: string;
  value: string;
  currentValue?: string;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
}

export interface RoundApplicationMetadata {
  id: string;
  lastUpdatedOn: number;
  applicationSchema: RoundApplicationQuestion[];
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

export interface GrantApplication {
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
  project: {
    lastUpdated: Number; // unix timestamp in milliseconds
    id: string;
    title: string;
    description: string;
    website: string;
    bannerImg?: string;
    logoImg: string;
    metaPtr: MetaPtr;
  };
  /** List of answers to questions */
  answers: Array<{
    questionId: Number;
    question: string;
    answer: string;
  }>;
}
