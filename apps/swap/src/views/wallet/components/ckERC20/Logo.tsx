import { ERC20Token, Token } from "@icpswap/swap-sdk";

import { Logos } from "../ckTokens/Logos";

export interface LogoProps {
  token: Token | undefined;
  erc20Token: ERC20Token | undefined;
  type: "mint" | "dissolve";
}

export default function Logo({ type }: LogoProps) {
  return (
    <Logos
      logo0={type === "mint" ? "/images/chain/eth.png" : "/images/chain/icp.png"}
      logo1={type === "mint" ? "/images/chain/icp.png" : "/images/chain/eth.png"}
    />
  );
}
