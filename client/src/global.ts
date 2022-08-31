// import { Provider } from "@wagmi/core";
import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";

export interface Global {
  web3Provider: Web3Provider | undefined;
  signer: Signer | undefined;
  chainID: number | undefined;
}

export const global: Global = {
  web3Provider: undefined,
  signer: undefined,
  chainID: undefined,
};
