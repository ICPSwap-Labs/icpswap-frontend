import { Token } from "@icpswap/swap-sdk";
import { WICPCanisterId } from "constants/canister";
import { TokenInfo, TokenMetadata } from "types/token";
import { Principal } from "@dfinity/principal";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export { TOKEN_STANDARD };

export const XTCCanisterId = "aanaa-xaaaa-aaaah-aaeiq-cai";

export const WRAPPED_ICP_METADATA: TokenMetadata = {
  standardType: TOKEN_STANDARD.EXT,
  metadata: [],
  name: "Wrapped ICP",
  decimals: 8,
  symbol: "WICP",
  canisterId: Principal.fromText(WICPCanisterId ?? "aaaaa-aa"),
};

export const WRAPPED_ICP_TOKEN_INFO: TokenInfo = {
  ...WRAPPED_ICP_METADATA,
  logo: `/images/tokens/${WRAPPED_ICP_METADATA.canisterId.toString()}.jpeg`,
  transFee: BigInt(0),
  canisterId: WRAPPED_ICP_METADATA.canisterId.toString(),
  totalSupply: BigInt(0),
};

export const WRAPPED_ICP = new Token({
  address: WRAPPED_ICP_TOKEN_INFO.canisterId,
  decimals: WRAPPED_ICP_TOKEN_INFO.decimals,
  symbol: WRAPPED_ICP_TOKEN_INFO.symbol,
  name: WRAPPED_ICP_TOKEN_INFO.name,
  logo: WRAPPED_ICP_TOKEN_INFO.logo,
  standard: TOKEN_STANDARD.EXT,
  transFee: Number(WRAPPED_ICP_TOKEN_INFO.transFee),
});

export const XTC = new Token({
  address: XTCCanisterId,
  decimals: 12,
  symbol: "XTC",
  name: "Cycles",
  logo: "",
  standard: TOKEN_STANDARD.DIP20_XTC,
  transFee: 0,
});

export const SNS1 = new Token({
  address: "zfcdd-tqaaa-aaaaq-aaaga-cai",
  decimals: 8,
  symbol: "SNS1",
  name: "SNS1",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 0,
});

export const CHAT = new Token({
  address: "2ouva-viaaa-aaaaq-aaamq-cai",
  decimals: 8,
  symbol: "CHAT",
  name: "CHAT",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 0,
});

export const CAT = new Token({
  address: "uf2wh-taaaa-aaaaq-aabna-cai",
  decimals: 8,
  symbol: "CAT",
  name: "CatalyzeDAO",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 0,
});

export const MOD = new Token({
  address: "xsi2v-cyaaa-aaaaq-aabfq-cai",
  decimals: 8,
  symbol: "MOD",
  name: "Modclub",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 10000,
});

export const BoomDAO = new Token({
  address: "vtrom-gqaaa-aaaaq-aabia-cai",
  decimals: 8,
  symbol: "BOOM",
  name: "BoomDAO",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100000,
});

export const ICX = new Token({
  address: "rffwt-piaaa-aaaaq-aabqq-cai",
  decimals: 8,
  symbol: "ICX",
  name: "IC-X",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100000,
});

export const NUA = new Token({
  address: "rxdbk-dyaaa-aaaaq-aabtq-cai",
  decimals: 8,
  symbol: "NUA",
  name: "Nuance",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100000,
});

export const SONIC = new Token({
  address: "qbizb-wiaaa-aaaaq-aabwq-cai",
  decimals: 8,
  symbol: "SONIC",
  name: "Sonic",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100000,
});
