import type { Token } from "@icpswap/swap-sdk";
import type { FarmState, Null } from "@icpswap/types";
import { Tooltip } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import { useFarmIsPending } from "hooks/staking-farm/useFarmIsPending";
import { useTranslation } from "react-i18next";

interface PendingPanelProps {
  state: FarmState | Null;
  farmId: string | Null;
  rewardToken: Token | Null;
}

export function PendingPanel({ farmId, state, rewardToken }: PendingPanelProps) {
  const { t } = useTranslation();
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
      <Tooltip tips={t("farm.pending.panel.description")}>
        <Typography sx={{ color: "#F7B231", fontSize: "12px" }}>{t("common.pending")}</Typography>
      </Tooltip>
    </Box>
  ) : null;
}
