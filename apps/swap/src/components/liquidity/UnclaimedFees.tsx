import { useCallback, useState, useMemo } from "react";
import { Typography, Box, Button, CircularProgress } from "components/Mui";
import { Flex, Tooltip } from "@icpswap/ui";
import { formatDollarAmount, nonUndefinedOrNull, BigNumber } from "@icpswap/utils";
import { usePositionContext } from "components/swap/index";
import { collect } from "@icpswap/hooks";
import { decodePositionKey } from "utils/swap";
import { useTips, MessageTypes } from "hooks/useTips";
import { useGlobalContext } from "hooks/index";
import { ResultStatus } from "@icpswap/types";
import { useSwapWithdrawByTokenId } from "hooks/swap/index";
import { useTranslation } from "react-i18next";
import { POSITIONS_FEES_REFRESH_KEY } from "constants/liquidity";

export interface UnclaimedFeesProps {
  className?: string;
}

export function UnclaimedFees({ className }: UnclaimedFeesProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [openTip, closeTip] = useTips();
  const { positionFeesValue, positionFees } = usePositionContext();
  const { setRefreshTriggers } = useGlobalContext();
  const withdraw = useSwapWithdrawByTokenId();

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
        const { poolId, positionIndex, token0, token0Fee, token1, token1Fee } = decodePositionKey(key);

        if (nonUndefinedOrNull(poolId) && nonUndefinedOrNull(positionIndex)) {
          const result = await collect(poolId, {
            positionId: BigInt(positionIndex),
          });

          if (result.status === ResultStatus.OK) {
            const amount0 = result.data?.amount0;
            const amount1 = result.data?.amount1;

            const withdrawToken0 = async () => {
              if (!amount0 || !token0 || !token0Fee) return false;
              if (!new BigNumber(amount0.toString()).minus(token0Fee).isGreaterThan(0)) return true;

              return await withdraw({
                tokenId: token0,
                poolId,
                amount: amount0,
                tokenFee: token0Fee,
              });
            };

            const withdrawToken1 = async () => {
              if (!amount1 || !token1 || !token1Fee) return false;
              if (!new BigNumber(amount1.toString()).minus(token1Fee).isGreaterThan(0)) return true;

              return await withdraw({
                tokenId: token1,
                poolId,
                amount: amount1,
                tokenFee: token1Fee,
              });
            };

            withdrawToken0();
            withdrawToken1();
          }

          return result;
        }

        return undefined;
      }),
    ).catch((error) => console.error("Collect all position fees error: ", JSON.stringify(error)));

    setRefreshTriggers(POSITIONS_FEES_REFRESH_KEY);

    closeTip(loading_key);

    setLoading(false);
  }, [positionFees, availableFees]);

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
