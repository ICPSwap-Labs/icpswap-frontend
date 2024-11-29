import { Typography, Box, useTheme } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Tooltip } from "@icpswap/ui";
import { useFarmIsPending } from "hooks/staking-farm/useFarmIsPending";
import type { FarmState, Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";

interface PendingPanelProps {
  state: FarmState | Null;
  farmId: string | Null;
  rewardToken: Token | Null;
}

export function PendingPanel({ farmId, state, rewardToken }: PendingPanelProps) {
  const theme = useTheme();

  const isPending = useFarmIsPending({ farmId, state, rewardToken });

  return isPending ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "6px 8px",
      }}
    >
      <Tooltip
        tips={
          <Trans>
            Although staking has started, the project's reward tokens haven't been deposited into the staking pool yet.
            This delay may be due to technical or operational issues, temporarily preventing users from receiving
            rewards. Once the tokens are added, rewards will be distributed.
          </Trans>
        }
      >
        <Typography sx={{ color: "#F7B231", fontSize: "12px" }}>
          <Trans>Pending</Trans>
        </Typography>
      </Tooltip>
    </Box>
  ) : null;
}
