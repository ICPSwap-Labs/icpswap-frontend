import { useCallback, useMemo, useState } from "react";
import { getUserTokens } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { BigNumber, nonUndefinedOrNull } from "@icpswap/utils";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { useTips, MessageTypes } from "hooks/index";
import { useTranslation } from "react-i18next";

export function useSyncYourTokensHandler() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const { updateTaggedTokens, taggedTokens } = useTaggedTokenManager();
  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const callback = useCallback(async () => {
    if (!principal) return;

    setLoading(true);

    const result = await getUserTokens({ principal: principal.toString() });

    if (result) {
      const allUserTokens = (result.tokens ?? [])
        .filter((e) => !new BigNumber(e.balance).isEqualTo(0))
        .map((e) => e.token.toString());

      const hasNewToken = allUserTokens.find((e) => !taggedTokens.includes(e));

      if (nonUndefinedOrNull(hasNewToken)) {
        openTip(t`Tokens synced successfully`, MessageTypes.success);
      } else {
        openTip(t`Sync completed, no new tokens`, MessageTypes.success);
      }

      updateTaggedTokens(allUserTokens);
    } else {
      openTip(t`Sync failed, please try again`, MessageTypes.error);
    }

    setLoading(false);
  }, [principal, taggedTokens]);

  return useMemo(() => ({ loading, syncYourTokensHandler: callback }), [callback, loading]);
}
