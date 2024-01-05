import type { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core";
import { Web3Provider, type ExternalProvider } from "@ethersproject/providers";
import { type TypedDataField } from "@ethersproject/abstract-signer";
import {
    encodePacked,
    fromBytes,
    toBytes,
    type Hex,
    type WalletClient,
    toHex,
    isHex,
    hexToSignature,
    signatureToHex,
  } from "viem";
  import * as chains from "viem/chains";
  import * as customChains from "./custom-chains.js";

export function getRPCProviderOwner(web3Provider: any): SmartAccountSigner {
  const provider = new Web3Provider(web3Provider as ExternalProvider);
  const signer = provider.getSigner();

  return {
    getAddress: async () =>
      Promise.resolve((await signer.getAddress()) as `0x${string}`),
    signMessage: async (msg: Uint8Array | string) =>
      (await signer.signMessage(msg)) as `0x${string}`,
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData(
        (await signer._signTypedData(
          params.domain!,
          params.types as unknown as Record<string, TypedDataField[]>,
          params.message
        )) as Hex
      );
    },
  };
}

export const fixSignedData = (sig: Hex): Hex => {
    let signature = sig;
    if (!isHex(signature)) {
      signature = `0x${signature}`;
      if (!isHex(signature)) {
        throw new Error("Invalid signed data " + sig);
      }
    }
  
    let { r, s, v } = hexToSignature(signature);
    if (v === 0n || v === 1n) v += 27n;
    const joined = signatureToHex({ r, s, v });
    return joined;
  };


  export const getChain = (chainId: number): chains.Chain => {
    for (const chain of Object.values(chains).concat(
      Object.values(customChains)
    )) {
      if (chain.id === chainId) {
        return chain;
      }
    }
    throw new Error("could not find chain");
  };
  