export const bitcoinBlockExplorer = (height: number) => `https://www.blockchain.com/explorer/blocks/btc/${height}`;

export const bitcoinAddressExplorer = (address: string) =>
  `https://www.blockchain.com/explorer/addresses/btc/${address}`;

export const bitcoinTransactionExplorer = (hash: string) =>
  `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
