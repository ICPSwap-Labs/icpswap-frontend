export function isBigIntMemo(
  memo: bigint | number[] | undefined
): memo is bigint {
  if (typeof memo === "bigint") return true;
  return false;
}
