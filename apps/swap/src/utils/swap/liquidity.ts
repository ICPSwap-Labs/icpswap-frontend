import { type Position } from "@icpswap/swap-sdk";

export function encodePositionKey(position: Position | undefined, index: bigint | number) {
  if (!position) return undefined;
  return `${position.pool.id}_${index.toString()}`;
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
