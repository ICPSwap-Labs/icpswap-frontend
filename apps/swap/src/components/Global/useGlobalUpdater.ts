import { useFetchInfoAllTokens } from "@icpswap/hooks";
import { usePlugExternalDisconnect } from "hooks/auth/usePlug";
import { useBeforeActorSubmit } from "hooks/useActorSubmit";
import { usePriceAlertsEmailSeconds } from "hooks/usePriceAlertsEmailSeconds";
import { useFetchAllSwapTokens, useFetchBridgeTokens, useFetchGlobalTokenList } from "store/global/hooks";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";

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
