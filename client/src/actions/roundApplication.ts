import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import RoundABI from "../contracts/abis/Round.json";
import { useFetchRoundByAddress } from "../services/graphqlClient";
import PinataClient from "../services/pinata";
import { Metadata, Project } from "../types";
import RoundApplicationBuilder from "../utils/RoundApplicationBuilder";
import fetchGrantData from "./grantsMetadata";
import { getRoundApplicationMetadata } from "./rounds";

const submitApplication = async (
  client: ApolloClient<NormalizedCacheObject>,
  roundAddress: string,
  formInputs: { [id: number]: string }
) => {
  const roundInfo = await useFetchRoundByAddress(client, roundAddress!);

  if (!roundInfo) {
    console.error("cannot load round data", roundInfo);
    return;
  }

  const roundApplicationMetadata = await getRoundApplicationMetadata(
    roundInfo.round.applicationMetaPtr.pointer
  );

  if (!roundApplicationMetadata) {
    console.error("cannot load round application metadata", roundAddress);
    return;
  }

  const { projectQuestionId } = roundApplicationMetadata;
  if (projectQuestionId === undefined) {
    console.error("cannot find project question id", roundAddress);
    return;
  }

  const projectId = formInputs[projectQuestionId];
  const projectMetadata: Metadata | null = await fetchGrantData(
    client,
    Number(projectId)
  );
  if (!projectMetadata) {
    throw new Error(`cannot find project metadata ${roundAddress}`);
  }

  const project: Project = {
    lastUpdated: 0,
    id: projectId,
    title: projectMetadata.title,
    description: projectMetadata.description,
    website: projectMetadata.website,
    bannerImg: projectMetadata.bannerImg!,
    logoImg: projectMetadata.logoImg!,
    metaPtr: {
      protocol: String(projectMetadata.protocol),
      pointer: projectMetadata.pointer,
    },
  };

  // FIXME: this is temporarily until the round manager adds the encrypted field
  roundApplicationMetadata.applicationSchema.forEach((question) => {
    if (/email/i.test(question.question.toLowerCase())) {
      // eslint-disable-next-line
      question.encrypted = true;
    }
  });

  const builder = new RoundApplicationBuilder(
    true,
    project,
    roundApplicationMetadata
  );
  const application = await builder.build(roundAddress, formInputs);

  const pinataClient = new PinataClient();

  const resp = await pinataClient.pinJSON(application);
  const metaPtr = {
    protocol: "1",
    pointer: resp.IpfsHash,
  };

  const { data: signer } = useSigner();
  // global.web3Provider!.getSigner();
  const contract = new ethers.Contract(roundAddress, RoundABI, signer!);

  const projectUniqueID = ethers.utils.formatBytes32String(
    projectId.toString()
  );
  try {
    await contract.applyToRound(projectUniqueID, metaPtr);
    // return true;
  } catch (e) {
    console.error("error calling applyToRound:", e);
  }
};

export default submitApplication;
