import { ERC20Token, Token } from "@icpswap/swap-sdk";

import { Logos } from "../ckTokens/Logos";

export interface LogoProps {
  token: Token | undefined;
  erc20Token: ERC20Token | undefined;
  type: "mint" | "dissolve";
}

export default function Logo({ type, token, erc20Token }: LogoProps) {
  return (
    <Logos
      logo0={type === "mint" ? erc20Token?.logo : token?.logo}
      logo1={type === "mint" ? token?.logo : erc20Token?.logo}
      erc20={type === "mint" ? "logo0" : "logo1"}
    />
  );
}
