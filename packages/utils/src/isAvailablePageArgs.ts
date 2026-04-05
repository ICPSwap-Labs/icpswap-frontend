/**
 * Returns true when pagination arguments are usable: `limit` is truthy and `offset` is defined
 * (including `0`).
 */
export function isAvailablePageArgs(offset: number, limit: number): boolean {
  return (!!offset || offset === 0) && !!limit;
}
