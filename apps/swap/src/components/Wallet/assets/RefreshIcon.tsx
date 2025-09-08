import { useCallback } from "react";
import { Box } from "components/Mui";
import { TOKEN_ASSETS_REFRESH } from "constants/wallet";
import { useRefreshTriggerManager } from "hooks/index";

export function RefreshIcon() {
  const [, setRefreshTrigger] = useRefreshTriggerManager(TOKEN_ASSETS_REFRESH);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger, TOKEN_ASSETS_REFRESH]);

  return (
    <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleRefresh}>
      <img src="/images/wallet/refresh.svg" alt="" />
    </Box>
  );
}
