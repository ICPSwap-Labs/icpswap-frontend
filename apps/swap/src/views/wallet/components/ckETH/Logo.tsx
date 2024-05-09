import { ckETH } from "constants/tokens";
import ethTokenSVG from "assets/images/token/ETH.svg";

import { Logos } from "../ckTokens/Logos";

export default function Logo({ type }: { type: "mint" | "dissolve" }) {
  return (
    <Logos logo0={type === "mint" ? ethTokenSVG : ckETH.logo} logo1={type === "mint" ? ckETH.logo : ethTokenSVG} />
  );
}
