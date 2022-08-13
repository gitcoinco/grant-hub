import { ethers } from "ethers";
import { Dispatch } from "redux";
import ProjectRegistryABI from "../contracts/abis/ProjectRegistry.json";
import { addressesByChainID } from "../contracts/deployments";
import { RootState } from "../reducers";
import { NewGrant, Status } from "../reducers/newGrant";
import PinataClient from "../services/pinata";
import { Project } from "../types/index";

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

export const publishGrant =
  (grantId?: string) =>
  //   (grantId: string | undefined, _content: any, images: Images) =>

  async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const { metadata: formMetaData, credentials: formCredentials } =
      state.projectForm;

    if (formMetaData === undefined) {
      return;
    }
    const application = {
      ...formMetaData,
    } as Project;

    // const content = _content;
    const pinataClient = new PinataClient();
    dispatch(grantStatus(Status.UploadingImages, undefined));
    if (formMetaData?.bannerImg) {
      const resp = await pinataClient.pinFile(formMetaData.bannerImg);
      application.bannerImg = resp.IpfsHash;
    }

    if (formMetaData?.logoImg) {
      const resp = await pinataClient.pinFile(formMetaData.logoImg);
      application.logoImg = resp.IpfsHash;
    }

    application.credentials = formCredentials;

    dispatch(grantStatus(Status.UploadingJSON, undefined));
    const resp = await pinataClient.pinJSON(application);
    const metadataCID = resp.IpfsHash;

    const { chainID } = state.web3;
    const addresses = addressesByChainID(chainID!);
    const signer = (global as any).web3Provider?.getSigner();
    const projectRegistry = new ethers.Contract(
      addresses.projectRegistry,
      ProjectRegistryABI,
      signer
    );

    dispatch(grantStatus(Status.WaitingForSignature, undefined));
    let projectTx;

    if (grantId !== undefined) {
      try {
        projectTx = await projectRegistry.updateProjectMetadata(grantId, {
          protocol: 1,
          pointer: metadataCID,
        });
      } catch (e) {
        dispatch(grantStatus(Status.Error, "transaction error"));
        console.error("tx error", e);
        return;
      }
    } else {
      try {
        projectTx = await projectRegistry.createProject({
          protocol: 1,
          pointer: metadataCID,
        });
      } catch (e) {
        dispatch(grantStatus(Status.Error, "transaction error"));
        console.error("tx error", e);
        return;
      }
    }

    dispatch(grantStatus(Status.TransactionInitiated, undefined));
    const txStatus = await projectTx.wait();
    if (txStatus.status) {
      dispatch(grantStatus(Status.Completed, undefined));
    }
  };
