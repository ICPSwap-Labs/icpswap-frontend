import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { Switch } from "components/index";
import { useSwapProAutoRefreshManager } from "store/swap/cache/hooks";
import { memo, useEffect, useState } from "react";

const AUTO_REFRESH_SECONDS = 30;

export interface AutoRefreshProps {
  initSeconds?: number;
  trigger?: () => void;
}

export const AutoRefresh = memo(({ initSeconds = AUTO_REFRESH_SECONDS, trigger }: AutoRefreshProps) => {
  const [seconds, setSeconds] = useState(initSeconds);
  const [autoRefresh, updateAutoRefresh] = useSwapProAutoRefreshManager();

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    updateAutoRefresh(checked);
  };

  useEffect(() => {
    let timer: number | undefined;

    if (autoRefresh) {
      let seconds = initSeconds;

      setSeconds(initSeconds);

      timer = window.setInterval(() => {
        if (seconds === 0) {
          setSeconds(initSeconds);
          if (trigger) trigger();
          seconds = initSeconds;
        } else {
          setSeconds(seconds - 1);
          seconds -= 1;
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      timer = undefined;
      return undefined;
    };
  }, [autoRefresh]);

  return (
    <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
      <Typography fontSize="12px">
        <Trans>Auto Refresh</Trans>
        {autoRefresh ? (
          <>
            (
            <Typography component="span" color="text.primary">
              {seconds}s
            </Typography>
            )
          </>
        ) : null}
      </Typography>
      <Switch checked={autoRefresh} onChange={handleSwitch} />
    </Box>
  );
});
