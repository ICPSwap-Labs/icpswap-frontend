// import { useFetchInfoAllTokens } from "hooks/info/useInfoTokens";
import { useFetchInfoAllTokens } from "@icpswap/hooks";
import { useFetchBridgeTokens } from "store/global/hooks";
import { usePriceAlertsEmailSeconds } from "hooks/usePriceAlertsEmailSeconds";

export function GlobalFetch() {
  useFetchInfoAllTokens();
  useFetchBridgeTokens();
  usePriceAlertsEmailSeconds();

  return null;
}
