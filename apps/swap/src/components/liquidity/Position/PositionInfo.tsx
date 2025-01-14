import { Typography, Button, useMediaQuery, useTheme, Box } from "components/Mui";
import { IsSneedOwner, MainCard } from "components/index";
import { isNullArgs, isValidAccount, isValidPrincipal, nonNullArgs, numToPercent, shorten } from "@icpswap/utils";
import { Flex, TextButton, APRPanel } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { useAddressAlias, usePositionAPRChartData } from "@icpswap/hooks";
import { PositionPriceRange, TransferPosition, PositionRangeState } from "components/liquidity/index";
import { LimitLabel } from "components/swap/limit-order/index";
import { usePositionState, useLoadLiquidityPageCallback } from "hooks/liquidity";
import { useIsSneedOwner, useRefreshTriggerManager, useSneedLedger } from "hooks/index";
import { useCallback, useMemo } from "react";
import { Null } from "@icpswap/types";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";
import { useHistory } from "react-router-dom";
import { useAvailableFarmsForPool, useLiquidityIsStakedByOwner } from "hooks/staking-farm";
import { useIsLimitOrder } from "hooks/swap/limit-order";

interface PositionInfoProps {
  position: Position;
  positionId: string;
  owner: string | Null;
  isOwner: boolean;
}

export function PositionInfo({ position, positionId, isOwner, owner }: PositionInfoProps) {
  const theme = useTheme();
  const history = useHistory();
  const positionState = usePositionState(position);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [, setRefreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const tokenIds = useMemo(() => {
    return [position.pool.token0.address, position.pool.token1.address];
  }, [position.pool]);

  const { result: positionChartData } = usePositionAPRChartData(position.pool.id, BigInt(positionId));
  const availableFarmsForPool = useAvailableFarmsForPool({ poolId: position.pool.id });
  // TODO Multiple farms for this pool
  const farmId = useMemo(() => {
    return availableFarmsForPool?.[0];
  }, [availableFarmsForPool]);
  const isStakedByOwner = useLiquidityIsStakedByOwner({ positionId, farmId: availableFarmsForPool?.[0] });

  const handleTransferSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  const apr = useMemo(() => {
    if (isNullArgs(positionChartData) || positionChartData.length === 0) return null;
    return positionChartData[positionChartData.length - 1].apr;
  }, [positionChartData]);

  const sneedLedger = useSneedLedger(tokenIds);
  const isSneed = useIsSneedOwner({ owner, sneedLedger });

  const loadIncreaseLiquidity = useLoadLiquidityPageCallback({
    positionId,
    poolId: position.pool.id,
    page: "increase",
  });

  const loadDecreaseLiquidity = useLoadLiquidityPageCallback({
    positionId,
    poolId: position.pool.id,
    page: "decrease",
  });

  const handleToFarm = useCallback(() => {
    if (!farmId) return;
    history.push(`/farm/details/${farmId}`);
  }, [history, farmId]);

  const showStakeFarmButton = useMemo(() => {
    return !!farmId && isStakedByOwner === false;
  }, [farmId, isStakedByOwner]);

  const { result: addressAlias } = useAddressAlias({
    account: owner ? (isValidAccount(owner) ? owner : null) : null,
    principal: owner ? (isValidPrincipal(owner) ? owner : null) : null,
  });

  const isLimit = useIsLimitOrder({ poolId: position.pool.id, positionId });

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start" fullWidth>
        <Flex fullWidth align="flex-start" justify="space-between">
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            <Trans>Position Info</Trans>
          </Typography>
          {isLimit ? <LimitLabel /> : null}
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Position ID</Trans>
          </Typography>

          <Typography color="text.primary">{positionId}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Owner</Trans>
          </Typography>

          <Flex gap="0 4px">
            <Typography color="text.primary">
              {owner ? (nonNullArgs(addressAlias) ? addressAlias : shorten(owner)) : "--"}
            </Typography>

            <IsSneedOwner isSneed={isSneed} />
          </Flex>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>APR</Trans>
          </Typography>

          <Typography color="text.primary">
            {nonNullArgs(apr) ? <APRPanel value={numToPercent(apr, 2)} /> : "--"}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>Price Range</Trans>
          </Typography>

          <Flex vertical gap="7px 0" align="flex-end">
            <PositionPriceRange position={position} />
            <PositionRangeState state={positionState} />
          </Flex>
        </Flex>

        {isOwner && isLimit === false ? (
          <Flex fullWidth>
            <TransferPosition
              position={position}
              positionId={BigInt(positionId)}
              onTransferSuccess={handleTransferSuccess}
            >
              <TextButton sx={{ fontWeight: 500 }}>
                <Trans>Transfer Position</Trans>
              </TextButton>
            </TransferPosition>
          </Flex>
        ) : null}

        {isOwner && isLimit === false ? (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                matchDownSM && showStakeFarmButton ? "1fr" : showStakeFarmButton ? "1fr 1fr 1fr" : "1fr 1fr",
              gap: "20px 12px",
            }}
          >
            <Button
              variant="contained"
              className="secondary"
              size={matchDownSM ? "small" : "medium"}
              onClick={loadDecreaseLiquidity}
              sx={{ height: "44px" }}
            >
              <Trans>Remove Liquidity</Trans>
            </Button>
            <Button
              variant="contained"
              className="secondary"
              size={matchDownSM ? "small" : "medium"}
              onClick={loadIncreaseLiquidity}
              sx={{ height: "44px" }}
            >
              <Trans>Increase Liquidity</Trans>
            </Button>
            {showStakeFarmButton ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleToFarm}
                sx={{ height: "44px" }}
              >
                <Trans>Stake Farm</Trans>
              </Button>
            ) : null}
          </Box>
        ) : null}

        {farmId && isStakedByOwner === true && isLimit === false ? (
          <Button
            fullWidth
            variant="contained"
            className="secondary"
            sx={{ height: "44px" }}
            size={matchDownSM ? "small" : "medium"}
            onClick={handleToFarm}
          >
            <Trans>Unstake Farm</Trans>
          </Button>
        ) : null}
      </Flex>
    </MainCard>
  );
}
