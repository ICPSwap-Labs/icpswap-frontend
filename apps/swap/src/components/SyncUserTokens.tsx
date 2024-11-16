import { useCallback, useState } from "react";
import { Typography, CircularProgress } from "components/Mui";
import { t, Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { getHelperUserTokens } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { BigNumber, nonNullArgs } from "@icpswap/utils";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { useTips, MessageTypes } from "hooks/index";

export function SyncUserTokens() {
  const principal = useAccountPrincipal();
  const { updateTaggedTokens, taggedTokens } = useTaggedTokenManager();
  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const handleSync = useCallback(async () => {
    if (!principal) return;

    setLoading(true);

    const result = await getHelperUserTokens({ principal: principal.toString() });

    if (result) {
      const allUserTokens = result.tokens
        .filter((e) => !new BigNumber(e.balance).isEqualTo(0))
        .map((e) => e.token.toString());

      const hasNewToken = allUserTokens.find((e) => !taggedTokens.includes(e));

      if (nonNullArgs(hasNewToken)) {
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

  return (
    <Flex gap="0 4px" onClick={handleSync} sx={{ cursor: "pointer" }}>
      <Typography align="center">
        {loading ? <Trans>Syncing your tokens...</Trans> : <Trans>Sync your tokens here</Trans>}
      </Typography>
      <Flex
        sx={{
          color: "#ffffff",
          width: "24px",
          height: "24px",
          overflow: "hidden",
        }}
      >
        {loading ? <CircularProgress color="inherit" size={14} /> : <img src="/images/sync.svg" alt="" />}
      </Flex>
    </Flex>
  );
}