/* eslint-disable import/prefer-default-export */
// This just disables default export as this utils file will be intended to return multiple utils
import { datadogRum } from "@datadog/browser-rum";
import { getAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import { chains } from "../contracts/deployments";

const ftmTestnetIcon = "../assets/ftm-testnet.png";
const ftmMainnetIcon = "../assets/fantom-ftm-logo.png";
const optimismIcon = "../assets/optimsim-ethereum-op-logo.png";
const ethIcon = "../assets/eth-diamond-glyph.png";

export function shortAddress(address: string): string {
  try {
    const formattedAddress = getAddress(address);
    return `${formattedAddress.substring(0, 6)}...${formattedAddress.substring(
      38
    )}`;
  } catch (e) {
    datadogRum.addError(e);
    console.log(e, "There was an error processing your address");
    return "Invalid Address";
  }
}

export const networkPrettyNames: { [key: string]: string } = {
  mainnet: "Mainnet",
  goerli: "Goerli",
  optimisticKovan: "Optimistic Kovan",
  fantomTestnet: "Fantom Testnet",
  fantom: "Fantom",
  optimism: "Optimism",
};

export const networkIcon: { [key: string]: string } = {
  mainnet: ethIcon,
  goerli: ethIcon,
  optimisticKovan: optimismIcon,
  fantomTestnet: ftmTestnetIcon,
  fantom: ftmMainnetIcon,
  optimism: optimismIcon,
};

export function getNetworkIcon(chainId: number): string {
  const rawName = chains[chainId];

  return networkIcon[rawName];
}

export function networkPrettyName(chainId: number): string {
  const rawName = chains[chainId];

  return networkPrettyNames[rawName];
}

export function isValidAddress(address: string): boolean {
  return ethers.utils.isAddress(address);
}
