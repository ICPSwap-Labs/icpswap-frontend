import { getUserTokens } from "@icpswap/hooks";
import { BigNumber, nonUndefinedOrNull } from "@icpswap/utils";
import { MessageTypes, useTips } from "hooks/index";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTaggedTokenManager } from "store/wallet/hooks";

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
  }, [principal, taggedTokens, openTip, t, updateTaggedTokens]);

  return useMemo(() => ({ loading, syncYourTokensHandler: callback }), [callback, loading]);
}
