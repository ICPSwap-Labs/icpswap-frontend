import { useCallback, useMemo } from "react";
import { Typography, Button, useTheme } from "components/Mui";
import { Flex, TokenImage, MainCard } from "components/index";
import { Position } from "@icpswap/swap-sdk";
import {
  isUndefinedOrNull,
  parseTokenAmount,
  formatDollarAmount,
  toSignificantWithGroupSeparator,
  BigNumber,
} from "@icpswap/utils";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { useUSDPriceById, useRefreshTriggerManager } from "hooks/index";
import { CollectFees } from "components/liquidity/CollectFees";
import { useTranslation } from "react-i18next";

export interface UncollectedFeesProps {
  position: Position | undefined;
  positionId: string;
  isOwner: boolean;
}

export function UncollectedFees({ position, positionId, isOwner }: UncollectedFeesProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("CollectFees");

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(position?.pool.id, positionId, refreshTrigger);

  const { token0, token1 } = position?.pool || {};

  const token0USDPrice = useUSDPriceById(token0?.address);
  const token1USDPrice = useUSDPriceById(token1?.address);

  const fee0USDValue = useMemo(() => {
    if (isUndefinedOrNull(token0) || isUndefinedOrNull(feeAmount0) || isUndefinedOrNull(token0USDPrice))
      return undefined;

    return parseTokenAmount(feeAmount0, token0.decimals).multipliedBy(token0USDPrice);
  }, [feeAmount0, token0, token0USDPrice]);

  const fee1USDValue = useMemo(() => {
    if (isUndefinedOrNull(token1) || isUndefinedOrNull(feeAmount1) || isUndefinedOrNull(token1USDPrice))
      return undefined;
    return parseTokenAmount(feeAmount1, token1.decimals).multipliedBy(token1USDPrice);
  }, [feeAmount1, token1, token1USDPrice]);

  const totalUSDValue = useMemo(() => {
    if (isUndefinedOrNull(fee0USDValue) || isUndefinedOrNull(fee1USDValue)) return undefined;
    return fee0USDValue.plus(fee1USDValue);
  }, [fee0USDValue, fee1USDValue]);

  const handleCollectSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  const disableCollect = useMemo(() => {
    if (
      isUndefinedOrNull(totalUSDValue) ||
      isUndefinedOrNull(feeAmount0) ||
      isUndefinedOrNull(feeAmount1) ||
      isUndefinedOrNull(token0) ||
      isUndefinedOrNull(token1)
    )
      return true;

    return (
      totalUSDValue.isEqualTo(0) ||
      (!new BigNumber(feeAmount0.toString()).isGreaterThan(token0.transFee) &&
        !new BigNumber(feeAmount1.toString()).isGreaterThan(token1.transFee))
    );
  }, [totalUSDValue, token0, token1, feeAmount0, feeAmount1]);

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start">
        <Typography color="text.primary" fontWeight={500}>
          {t("common.uncollected.fees")}
        </Typography>

        <Flex fullWidth justify="space-between">
          <Typography color="text.primary" fontWeight={500} fontSize="28px">
            {totalUSDValue ? formatDollarAmount(totalUSDValue.toString()) : "--"}
          </Typography>

          {isOwner ? (
            <CollectFees
              position={position}
              positionId={BigInt(positionId)}
              disabled={disableCollect}
              onCollectSuccess={handleCollectSuccess}
            >
              <Button
                variant="contained"
                size="large"
                sx={{ height: "44px", background: theme.colors.secondaryMain }}
                disabled={disableCollect}
              >
                {t("common.collect.fees")}
              </Button>
            </CollectFees>
          ) : null}
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Flex gap="0 6px">
            <TokenImage size="20px" logo={token0?.logo} tokenId={token0?.address} />
            <Typography sx={{ maxWidth: "187px" }} className="text-overflow-ellipsis">
              {token0?.symbol}
            </Typography>
          </Flex>

          <Flex vertical gap="6px 0" align="flex-end" justify="flex-end">
            <Typography align="right" color="text.primary">
              {feeAmount0 && token0
                ? toSignificantWithGroupSeparator(parseTokenAmount(feeAmount0, token0.decimals).toString())
                : "--"}
            </Typography>
            <Typography align="right">{fee0USDValue ? formatDollarAmount(fee0USDValue.toString()) : "--"}</Typography>
          </Flex>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Flex gap="0 6px">
            <TokenImage size="20px" logo={token1?.logo} tokenId={token1?.address} />
            <Typography sx={{ maxWidth: "187px" }} className="text-overflow-ellipsis">
              {token1?.symbol}
            </Typography>
          </Flex>

          <Flex vertical gap="6px 0" align="flex-end" justify="flex-end">
            <Typography align="right" color="text.primary">
              {feeAmount1 && token1
                ? toSignificantWithGroupSeparator(parseTokenAmount(feeAmount1, token1.decimals).toString())
                : "--"}
            </Typography>
            <Typography align="right">{fee1USDValue ? formatDollarAmount(fee1USDValue.toString()) : "--"}</Typography>
          </Flex>
        </Flex>
      </Flex>
    </MainCard>
  );
}
