import { ethers } from "ethers";
import ProjectRegistryABI from "../contracts/abis/ProjectRegistry.json";
import { getProviderByChainId } from "./utils";
import { addressesByChainID } from "../contracts/deployments";
import generateUniqueRoundApplicationID from "./roundApplication";
import { graphqlFetch } from "./graphql";

export const fetchProjectOwners = (chainID: number, projectID: string) => {
  const addresses = addressesByChainID(chainID);
  const appProvider = getProviderByChainId(chainID);

  const projectRegistry = new ethers.Contract(
    addresses.projectRegistry,
    ProjectRegistryABI,
    appProvider
  );

  return projectRegistry.getProjectOwners(projectID);
};

export const fetchProjectApplicationsForChain = async (
  projectID: string,
  projectChainID: number,
  chainID: number,
  env: any
) => {
  const addresses = addressesByChainID(projectChainID);
  const projectApplicationID = generateUniqueRoundApplicationID(
    projectChainID,
    projectID,
    addresses.projectRegistry
  );

  // During the first alpha round, we created applications with the wrong chain id (using the
  // round chain instead of the project chain). This is a fix to display the applications with
  // the wrong application id. NOTE: there is a possibility of clash, because the contracts
  // have the same address on multiple chains.
  const projectApplicationIDWithChain = generateUniqueRoundApplicationID(
    chainID,
    projectID,
    addresses.projectRegistry
  );

  const response: any = await graphqlFetch(
    `query roundProjects($projectID: String, $projectApplicationIDWithChain: String) {
            roundProjects(where: { project_in: [$projectID, $projectApplicationIDWithChain] }) {
              status
              metaPtr {
                pointer
              },
              round {
                id
              }
            }
          }
          `,
    chainID,
    {
      projectID: projectApplicationID,
      projectApplicationIDWithChain,
    },
    env
  );

  return response.data.roundProjects.map((rp: any) => ({
    status: rp.status,
    roundID: rp.round.id,
    metaPtr: rp.metaPtr,
    chainId: chainID,
  }));
};
