import { ckBTC } from "constants/tokens";
import BTC_SVG from "assets/images/token/BTC.svg";
import { Logos } from "../ckTokens/Logos";

export default function Logo({ type }: { type: "mint" | "dissolve" }) {
  return <Logos logo0={type === "mint" ? BTC_SVG : ckBTC.logo} logo1={type === "mint" ? ckBTC.logo : BTC_SVG} />;
}
