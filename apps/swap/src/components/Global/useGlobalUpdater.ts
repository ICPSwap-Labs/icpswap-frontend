import { useFetchInfoAllTokens } from "@icpswap/hooks";
import { usePriceAlertsEmailSeconds } from "hooks/usePriceAlertsEmailSeconds";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { usePlugExternalDisconnect } from "hooks/auth/usePlug";
import { useFetchAllSwapTokens, useFetchBridgeTokens, useFetchGlobalTokenList } from "store/global/hooks";
import { useBeforeActorSubmit } from "hooks/useActorSubmit";

export function useGlobalUpdater() {
  useFetchInfoAllTokens();
  useFetchBridgeTokens();
  usePriceAlertsEmailSeconds();
  useFetchAllSwapTokens();
  usePlugExternalDisconnect();
  useFetchSnsAllTokensInfo();
  useFetchGlobalTokenList();

  useBeforeActorSubmit();
}
