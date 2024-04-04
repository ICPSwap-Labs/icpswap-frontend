import { Token } from "@icpswap/swap-sdk";
import { WICPCanisterId } from "constants/canister";
import { TokenInfo, TokenMetadata } from "types/token";
import { Principal } from "@dfinity/principal";
import { TOKEN_STANDARD } from "@icpswap/types";
import { LEDGER_CANISTER_ID } from "constants/icp";
import ICPAvatar from "../assets/images/icons/tokens/icp.svg";
import { ckETH_LEDGER_ID } from "./ckETH";
import { ckBTC_ID } from "./ckBTC";
import ckETHSVG from "../assets/images/token/ckETH.svg";
import ckBTCSVG from "../assets/images/token/ckBTC.svg";

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
  logo: `data:image/jpeg;base64,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`,
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

export const ICP_METADATA: TokenMetadata = {
  symbol: "ICP",
  name: "Internet Computer",
  decimals: 8,
  canisterId: Principal.fromText(LEDGER_CANISTER_ID),
  metadata: [],
  standardType: TOKEN_STANDARD.ICRC2,
};

export const ICP_TOKEN_INFO: TokenInfo = {
  ...ICP_METADATA,
  canisterId: ICP_METADATA.canisterId.toString(),
  transFee: BigInt(10000),
  logo: ICPAvatar,
  totalSupply: BigInt(0),
};

export const ICP = new Token({
  address: ICP_TOKEN_INFO.canisterId,
  decimals: ICP_TOKEN_INFO.decimals,
  symbol: ICP_TOKEN_INFO.symbol,
  name: ICP_TOKEN_INFO.name,
  logo: ICP_TOKEN_INFO.logo,
  standard: ICP_TOKEN_INFO.standardType,
  transFee: Number(ICP_TOKEN_INFO.transFee),
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

export const ckBTC = new Token({
  address: ckBTC_ID,
  decimals: 8,
  symbol: "ckBTC",
  name: "ckBTC",
  logo: ckBTCSVG,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: 10,
});

export const ckETH = new Token({
  address: ckETH_LEDGER_ID,
  decimals: 18,
  symbol: "ckETH",
  name: "ckETH",
  logo: ckETHSVG,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: 2_000_000_000_000,
});

export const TRAX = new Token({
  address: "emww2-4yaaa-aaaaq-aacbq-cai",
  decimals: 8,
  symbol: "TRAX",
  name: "TRAX",
  logo: ckETHSVG,
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100000,
});

export const NTN = new Token({
  address: "f54if-eqaaa-aaaaq-aacea-cai",
  decimals: 8,
  symbol: "NTN",
  name: "Neutrinite",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 10_000,
});

export const GLDGov = new Token({
  address: "tyyy3-4aaaa-aaaaq-aab7a-cai",
  decimals: 8,
  symbol: "GLDGov",
  name: "Gold Governance Token",
  logo: "",
  standard: TOKEN_STANDARD.ICRC1,
  transFee: 100_000,
});
