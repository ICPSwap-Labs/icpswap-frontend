import { useCallback, useState } from "react";
import { Typography } from "components/Mui";
import { t } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { getHelperUserTokens } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { BigNumber } from "@icpswap/utils";
import { useTaggedTokenManager } from "store/wallet/hooks";

const SyncState = {
  loading: t`Syncing your tokens...`,
  success: t`Tokens synced successfully`,
  failed: t`Sync failed, please try again`,
  no_token: t`Sync completed, no new tokens`,
  default: t`Sync your tokens here`,
};

export function SyncUserTokens() {
  const principal = useAccountPrincipal();
  const { updateTaggedTokens } = useTaggedTokenManager();

  const [state, setState] = useState<string>(SyncState.default);

  const handleSync = useCallback(async () => {
    if (!principal) return;
    setState(SyncState.loading);

    const result = await getHelperUserTokens({ principal: principal.toString() });

    if (result) {
      const allUserTokens = result.tokens
        .filter((e) => !new BigNumber(e.balance).isEqualTo(0))
        .map((e) => e.token.toString());

      updateTaggedTokens(allUserTokens);

      if (allUserTokens.length > 0) {
        setState(SyncState.success);
      } else {
        setState(SyncState.failed);
      }
    } else {
      setState(SyncState.failed);
    }
  }, [principal]);

  return (
    <Flex gap="0 4px" onClick={handleSync} sx={{ cursor: "pointer" }}>
      <Typography align="center">{state}</Typography>
      <Flex
        sx={{
          color: "#ffffff",
          width: "24px",
          height: "24px",
          overflow: "hidden",
        }}
      >
        <img src="/images/sync.svg" alt="" />
      </Flex>
    </Flex>
  );
}
