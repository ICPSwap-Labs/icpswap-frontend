import { Principal } from "@icpswap/dfinity";
import type { SwapNFTTokenMetadata } from "@icpswap/types";
import { stringToArrayBuffer, toHexString } from "@icpswap/utils";

export function from32bits(data: number[]) {
  let value;

  for (let i = 0; i < 4; i++) {
    value = (value << 8) | data[i];
  }

  return value;
}

export function to32bits(num: number) {
  const arrayBuffer = new ArrayBuffer(4);
  new DataView(arrayBuffer).setUint32(0, num);
  return Array.from(new Uint8Array(arrayBuffer));
}

export function encodeTokenIdentifier(principal: string, index: number | bigint) {
  const padding = stringToArrayBuffer("\x0Atid");

  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(Number(index)),
  ]);
  return Principal.fromUint8Array(array).toText();
}

export function decodeTokenId(tid: string) {
  const p = [...Principal.fromText(tid).toUint8Array()];
  const padding = p.splice(0, 4);

  if (toHexString(padding) !== toHexString(stringToArrayBuffer("\x0Atid"))) {
    return {
      index: 0,
      canister: tid,
      token: encodeTokenIdentifier(tid, 0),
    };
  }
  return {
    index: from32bits(p.splice(-4)),
    canister: Principal.fromUint8Array(Uint8Array.from(p)).toText(),
    token: tid,
  };
}

export function getNFTSwapPoolId(nft: SwapNFTTokenMetadata) {
  let poolId = "";

  for (let i = 0; i < nft.attributes.length; i++) {
    if (nft.attributes[i].k === "pool") {
      poolId = nft.attributes[i].v;
      break;
    }
  }

  return poolId;
}

export * from "./NFT";
export * from "./trade";
