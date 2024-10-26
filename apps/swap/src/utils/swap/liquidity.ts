import { type Position } from "@icpswap/swap-sdk";

export function encodePositionKey(position: Position | undefined, index: bigint | number) {
  if (!position) return undefined;

  const { token0, token1 } = position.pool;

  const keyItems = [
    position.pool.id,
    index.toString(),
    token0.address,
    token0.transFee.toString(),
    token1.address,
    token1.transFee.toString(),
  ];

  return keyItems.join("_");
}

export function encodePositionKeyByPool(poolId: string | undefined, index: bigint | number) {
  if (!poolId) return undefined;

  return `${poolId}_${index.toString()}`;
}

export function decodePositionKey(key: string | undefined) {
  if (!key || !key.includes("_")) return {};

  const arr = key.split("_");

  return {
    poolId: arr[0],
    positionIndex: arr[1],
    token0: arr[2],
    token0Fee: arr[3],
    token1: arr[4],
    token1Fee: arr[5],
  };
}

export enum PositionState {
  OutOfRange = "outOfRange",
  InRange = "inRange",
  LEVEL0 = "level0",
  LEVEL1 = "level1",
  CLOSED = "closed",
}

export const getStateColor = (state: PositionState) => {
  switch (state) {
    case PositionState.OutOfRange:
      return "#9D332C";
    case PositionState.InRange:
      return "#54C081";
    case PositionState.LEVEL0:
      return "#FFD24C";
    case PositionState.LEVEL1:
      return "#D3625B";
    case PositionState.CLOSED:
      return "#8492C4";
    default:
      return "#54C081";
  }
};
