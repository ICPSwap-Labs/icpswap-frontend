export function isAvailablePageArgs(offset: number, limit: number): boolean {
  return (!!offset || offset === 0) && !!limit;
}
