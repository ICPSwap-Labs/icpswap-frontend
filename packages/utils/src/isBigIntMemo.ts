/** True only when `memo` is a `bigint` (typed array memos are not considered bigints here). */
export function isBigIntMemo(memo: bigint | number[] | undefined): memo is bigint {
  if (typeof memo === "bigint") return true;
  return false;
}
