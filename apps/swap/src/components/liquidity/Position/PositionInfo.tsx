import { Typography, Button, useMediaQuery, useTheme } from "components/Mui";
import { IsSneedOwner, MainCard } from "components/index";
import { isNullArgs, nonNullArgs, numToPercent, shorten } from "@icpswap/utils";
import { Flex, TextButton, APRPanel } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { useParsedQueryString, usePositionAPRChartData, useV3UserFarmInfo } from "@icpswap/hooks";
import { PositionPriceRange, TransferPosition, PositionRangeState } from "components/liquidity/index";
import { usePositionState, useLoadLiquidityPageCallback } from "hooks/liquidity";
import { useIsSneedOwner, useRefreshTriggerManager, useSneedLedger } from "hooks/index";
import { useCallback, useMemo } from "react";
import { Null } from "@icpswap/types";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";
import { useHistory } from "react-router-dom";
import { useAccountPrincipalString } from "store/auth/hooks";

interface PositionInfoProps {
  position: Position;
  positionId: string;
  owner: string | Null;
  isOwner: boolean;
}

export function PositionInfo({ position, positionId, isOwner, owner }: PositionInfoProps) {
  const theme = useTheme();
  const history = useHistory();
  const principal = useAccountPrincipalString();
  const positionState = usePositionState(position);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { farmId } = useParsedQueryString() as { farmId: string | Null };

  const [, setRefreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const tokenIds = useMemo(() => {
    return [position.pool.token0.address, position.pool.token1.address];
  }, [position.pool]);

  const { result: positionChartData } = usePositionAPRChartData(position.pool.id, BigInt(positionId));

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

  const handleUnstakeFarm = useCallback(() => {
    if (!farmId) return;
    history.push(`/farm/details/${farmId}`);
  }, [history, farmId]);

  const { result: userFarmInfo } = useV3UserFarmInfo(farmId, principal);

  const isStakedPositionOwner = useMemo(() => {
    if (isNullArgs(userFarmInfo)) return false;

    return !!userFarmInfo.positionIds.find((e) => e.toString() === positionId);
  }, [userFarmInfo, positionId]);

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start" fullWidth>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          <Trans>Position Info</Trans>
        </Typography>

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
            <Typography color="text.primary">{owner ? shorten(owner) : "--"}</Typography>

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

        {isOwner ? (
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

        {isOwner ? (
          <Flex gap="0 12px" fullWidth>
            <Button
              variant="contained"
              className="secondary"
              sx={{ flex: "50%" }}
              size={matchDownSM ? "small" : "large"}
              onClick={loadDecreaseLiquidity}
            >
              <Trans>Remove Liquidity</Trans>
            </Button>
            <Button
              variant="contained"
              className="secondary"
              sx={{ flex: "50%" }}
              size={matchDownSM ? "small" : "large"}
              onClick={loadIncreaseLiquidity}
            >
              <Trans>Increase Liquidity</Trans>
            </Button>
          </Flex>
        ) : null}

        {farmId && isStakedPositionOwner ? (
          <Button
            fullWidth
            variant="contained"
            className="secondary"
            sx={{ flex: "50%" }}
            size={matchDownSM ? "small" : "large"}
            onClick={handleUnstakeFarm}
          >
            <Trans>Unstake Farm</Trans>
          </Button>
        ) : null}
      </Flex>
    </MainCard>
  );
}
