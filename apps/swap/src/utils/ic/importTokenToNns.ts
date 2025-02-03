export const importTokenToNnsUrl = (tokenId: string): string => {
  return `https://nns.ic0.app/tokens/?import-ledger-id=${tokenId}`;
};
