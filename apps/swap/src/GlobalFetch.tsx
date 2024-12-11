// import { useFetchInfoAllTokens } from "hooks/info/useInfoTokens";
import { useFetchInfoAllTokens } from "@icpswap/hooks";

export function GlobalFetch() {
  useFetchInfoAllTokens();

  return null;
}
