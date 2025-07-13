import { IcpSwapAPITokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";

export function parseTokenStandards(tokenInfo: IcpSwapAPITokenInfo): TOKEN_STANDARD {
  if (isUndefinedOrNull(tokenInfo.standards)) return TOKEN_STANDARD.ICRC1;

  const standards = JSON.parse(tokenInfo.standards) as string[];

  return standards.includes("ICRC-2")
    ? TOKEN_STANDARD.ICRC2
    : standards.includes("ICRC-1")
    ? TOKEN_STANDARD.ICRC1
    : (standards[0] as TOKEN_STANDARD);
}
