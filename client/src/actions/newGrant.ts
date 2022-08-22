import { ethers } from "ethers";
import ProjectRegistryABI from "../contracts/abis/ProjectRegistry.json";
import { addressesByChainID } from "../contracts/deployments";
import { NewGrant, Status } from "../reducers/newGrant";
import PinataClient from "../services/pinata";
import { FormInputs, Project } from "../types/index";

export const NEW_GRANT_STATUS = "NEW_GRANT_STATUS";
export interface NewGrantStatus {
  type: typeof NEW_GRANT_STATUS;
  status: Status;
  error: string | undefined;
}

export const NEW_GRANT_CREATED = "NEW_GRANT_CREATED";
export interface GrantCreated {
  type: typeof NEW_GRANT_CREATED;
  id: number;
  metaData: string;
  owner?: string;
}

export const RESET_STATUS = "RESET_STATUS";
export interface IPFSResetTXStatus {
  type: typeof RESET_STATUS;
}

export type NewGrantActions = GrantCreated | NewGrantStatus | IPFSResetTXStatus;

export const resetStatus = (): NewGrantActions => ({
  type: RESET_STATUS,
});

export const grantStatus = (
  status: Status,
  error: string | undefined
): NewGrantActions => ({
  type: NEW_GRANT_STATUS,
  status,
  error,
});

export const grantCreated = ({
  id,
  metaData,
  owner,
}: NewGrant): NewGrantActions => ({
  type: NEW_GRANT_CREATED,
  id,
  metaData,
  owner,
});

export const publishGrant = async (
  formInputs: FormInputs,
  chainId: number,
  signer: ethers.Signer,
  grantId?: string
): Promise<any> => {
  if (formInputs === undefined) {
    throw new Error("form inputs are undefined");
  }
  const application = {
    ...formInputs,
  } as Project;

  const pinataClient = new PinataClient();

  if (formInputs?.bannerImg) {
    const resp = await pinataClient.pinFile(formInputs.bannerImg);
    application.bannerImg = resp.IpfsHash;
  }

  if (formInputs?.logoImg) {
    const resp = await pinataClient.pinFile(formInputs.logoImg);
    application.logoImg = resp.IpfsHash;
  }

  const resp = await pinataClient.pinJSON(application);
  const metadataCID = resp.IpfsHash;

  const addresses = addressesByChainID(chainId);

  if (!signer) {
    throw new Error("no signer");
  }

  const projectRegistry = new ethers.Contract(
    addresses.projectRegistry,
    ProjectRegistryABI,
    signer
  );

  let projectTx;

  if (grantId !== undefined) {
    try {
      projectTx = await projectRegistry.updateProjectMetadata(grantId, {
        protocol: 1,
        pointer: metadataCID,
      });
    } catch (e) {
      console.error("tx error", e);
      throw e;
    }
  } else {
    try {
      projectTx = await projectRegistry.createProject({
        protocol: 1,
        pointer: metadataCID,
      });
    } catch (e) {
      console.error("tx error", e);
      throw e;
    }
  }

  return projectTx.wait();
};
