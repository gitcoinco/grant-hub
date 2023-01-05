const isCID = (cid: string): boolean => {
  // This regular expression will match CIDs that are of the following formats:
  // Multihash CIDs: Qm[a-zA-Z0-9]{44}
  // Multicodec CIDs: Z[a-zA-Z0-9]{52}
  // Base58 CIDs: b[a-zA-Z0-9]{60}
  // Bitcoin Block CIDs: B[a-zA-Z0-9]{58}
  // Raw CIDs: [a - km - zA - HJ - NP - Z1 - 9]{ 70 }
  const cidRegex =
    /^(?:Qm[a-zA-Z0-9]{44}|Z[a-zA-Z0-9]{52}|b[a-zA-Z0-9]{60}|B[a-zA-Z0-9]{58}|[a-km-zA-HJ-NP-Z1-9]{70})/;
  return cidRegex.test(cid);
};

const getSegments = (): string[] => {
  const path = window?.location?.pathname ?? "/";
  return path.split("/");
};

export const resolveBasename = (): string => {
  const [, second, third] = getSegments();

  if (second === "ipfs" && isCID(third)) {
    return `/ipfs/${third}/`;
  }

  if (second === "ipns") {
    return `/ipns/${third}/`;
  }

  return "/";
};

export const isIpfsBasename = (): boolean => {
  const [, second, third] = getSegments();
  return (second === "ipfs" && isCID(third)) || second === "ipns";
};

export default {};
