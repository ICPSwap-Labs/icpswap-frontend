export function getPositionFeeKey(poolId: string, positionId: bigint) {
  return `${poolId}_${positionId.toString()}`;
}
