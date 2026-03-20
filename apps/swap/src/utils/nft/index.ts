import { Principal } from "@icp-sdk/core/principal";
import type { SwapNFTTokenMetadata } from "@icpswap/types";

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

export function toHexString(byteArray: number[]) {
  return Array.from(byteArray, (byte) => {
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }).join("");
}

export function encodeTokenIdentifier(principal: string, index: number | bigint) {
  // @ts-expect-error Ignore the Buffer error
  const padding = Buffer("\x0Atid");

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

  // @ts-expect-error
  if (toHexString(padding) !== toHexString(Buffer("\x0Atid"))) {
    return {
      index: 0,
      canister: tid,
      token: encodeTokenIdentifier(tid, 0),
    };
  }
  return {
    index: from32bits(p.splice(-4)),
    // @ts-expect-error
    canister: Principal.fromUint8Array(p).toText(),
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

export function getNFTSwapPositionId(nft: SwapNFTTokenMetadata) {
  let poolId = "";

  for (let i = 0; i < nft.attributes.length; i++) {
    if (nft.attributes[i].k === "positionId") {
      poolId = nft.attributes[i].v;
      break;
    }
  }

  return poolId;
}

export * from "./NFT";
export * from "./trade";
