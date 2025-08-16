export const ckBTC_ID = "mxzaz-hqaaa-aaaar-qaada-cai";

export const ckBTC_MINTER_ID = "mqygn-kiaaa-aaaar-qaadq-cai";

export const ckBTC_DASHBOARD = "https://dashboard.internetcomputer.org/bitcoin";

export const DISSOLVE_FEE = "0.0000001";

export const BTC_DISSOLVE_REFRESH = "BTC_DISSOLVE_REFRESH";

export const BTC_MINT_REFRESH = "BTC_MINT_REFRESH";

export const BITCOIN_CONFIRMATIONS = 6;

export const bitcoinBlockExplorer = (height: number) => `https://www.blockchain.com/explorer/blocks/btc/${height}`;

export const bitcoinAddressExplorer = (address: string) =>
  `https://www.blockchain.com/explorer/addresses/btc/${address}`;

export const bitcoinTransactionExplorer = (hash: string) =>
  `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
