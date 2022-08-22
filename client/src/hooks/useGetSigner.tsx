import { useSigner } from "wagmi";

export default function useGetSigner(): any {
  const { data: signer } = useSigner();

  return signer;
}
