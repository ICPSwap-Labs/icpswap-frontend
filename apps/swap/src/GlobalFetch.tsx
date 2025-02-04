// import { useFetchInfoAllTokens } from "hooks/info/useInfoTokens";
import { useFetchInfoAllTokens } from "@icpswap/hooks";
import { useFetchBridgeTokens } from "store/global/hooks";

export function GlobalFetch() {
  useFetchInfoAllTokens();
  useFetchBridgeTokens();

  return null;
}
