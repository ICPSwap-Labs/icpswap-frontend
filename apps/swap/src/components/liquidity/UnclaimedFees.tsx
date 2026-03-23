import { collect } from "@icpswap/hooks";
import { Flex, Tooltip } from "@icpswap/ui";
import { formatDollarAmount, nonUndefinedOrNull } from "@icpswap/utils";
import { Box, Button, CircularProgress, Typography } from "components/Mui";
import { usePositionContext } from "components/swap/index";
import { POSITIONS_FEES_REFRESH_KEY } from "constants/liquidity";
import { useGlobalContext } from "hooks/index";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { decodePositionKey } from "utils/swap";

export interface UnclaimedFeesProps {
  className?: string;
}

export function UnclaimedFees({ className }: UnclaimedFeesProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [openTip, closeTip] = useTips();
  const { positionFeesValue, positionFees } = usePositionContext();
  const { setRefreshTriggers } = useGlobalContext();

  const availableFees = useMemo(() => {
    if (!positionFees) return undefined;

    return Object.keys(positionFees).filter((key) => {
      return positionFees[key]?.isGreaterThan(0);
    });
  }, [positionFees]);

  const handleClaim = useCallback(async () => {
    if (!availableFees || availableFees.length === 0) return undefined;

    setLoading(true);

    const loading_key = openTip(t("swap.collecting.description"), MessageTypes.loading);

    await Promise.all(
      availableFees.map(async (key: string) => {
        const { poolId, positionIndex } = decodePositionKey(key);

        if (nonUndefinedOrNull(poolId) && nonUndefinedOrNull(positionIndex)) {
          const result = await collect(poolId, {
            positionId: BigInt(positionIndex),
          });

          return result;
        }

        return undefined;
      }),
    ).catch((error) => console.error("Collect all position fees error: ", JSON.stringify(error)));

    setRefreshTriggers(POSITIONS_FEES_REFRESH_KEY);

    closeTip(loading_key);

    setLoading(false);
  }, [availableFees, closeTip, openTip, setRefreshTriggers, t]);

  return (
    <Box sx={{ width: "260px" }}>
      <Flex gap="0 4px">
        <Typography>{t("common.uncollected.fees")}</Typography>
        <Tooltip tips={t`Earnings from your liquidity that haven’t been collected.`} />
      </Flex>

      <Flex gap="0 8px" sx={{ margin: "15px 0 0 0" }}>
        <Typography className={className}>
          {positionFeesValue ? formatDollarAmount(positionFeesValue.toString()) : "--"}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleClaim}
          disabled={loading || !positionFeesValue || positionFeesValue.isEqualTo(0)}
          startIcon={loading ? <CircularProgress color="inherit" size={16} /> : null}
        >
          {t("common.collect")}
        </Button>
      </Flex>
    </Box>
  );
}
