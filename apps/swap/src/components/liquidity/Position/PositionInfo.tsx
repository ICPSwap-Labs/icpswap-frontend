import { Typography, Button, useMediaQuery, useTheme, Box } from "components/Mui";
import { IsSneedOwner, MainCard } from "components/index";
import {
  BigNumber,
  isUndefinedOrNull,
  isValidAccount,
  isValidPrincipal,
  nonUndefinedOrNull,
  numToPercent,
  principalToAccount,
} from "@icpswap/utils";
import { Flex, TextButton, APRPanel, Link, TextualAddress } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { useAddressAlias, usePositionAPRChartData } from "@icpswap/hooks";
import { PositionPriceRange, TransferPosition, PositionRangeState } from "components/liquidity/index";
import { LimitLabel } from "components/swap/limit-order/index";
import { usePositionState, useLoadLiquidityPageCallback } from "hooks/liquidity";
import { useIsSneedOwner, useRefreshTriggerManager, useSneedLedger, useCopySuccess } from "hooks/index";
import { useCallback, useMemo } from "react";
import { Null } from "@icpswap/types";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";
import { useHistory } from "react-router-dom";
import { useAvailableFarmsForPool, useLiquidityIsStakedByOwner } from "hooks/staking-farm";
import { useIsLimitOrder } from "hooks/swap/limit-order";
import { useTranslation } from "react-i18next";
import { infoRoutesConfigs } from "routes/info.config";
import { useAccountPrincipal } from "store/auth/hooks";

interface PositionInfoProps {
  position: Position;
  positionId: string;
  owner: string | Null;
  isOwner: boolean;
}

export function PositionInfo({ position, positionId, isOwner, owner }: PositionInfoProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const positionState = usePositionState(position);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const principal = useAccountPrincipal();
  const copySuccess = useCopySuccess();

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
    if (isUndefinedOrNull(positionChartData) || positionChartData.length === 0) return null;
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

  const __owner = useMemo(() => {
    if (isUndefinedOrNull(owner)) return {};
    if (isValidAccount(owner)) return { account: owner, principal: null };
    if (isValidPrincipal(owner)) return { account: principalToAccount(owner), principal: owner };

    return {};
  }, [owner]);

  const isLimit = useIsLimitOrder({ poolId: position.pool.id, positionId });

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start" fullWidth>
        <Flex fullWidth align="flex-start" justify="space-between">
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            {t("liquidity.position.info")}
          </Typography>
          {isLimit ? <LimitLabel /> : null}
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.position.id")}</Typography>

          <Typography color="text.primary">{positionId}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.owner")}</Typography>

          <Flex gap="0 4px">
            <Typography color="text.primary">
              <TextualAddress
                owner={__owner.principal}
                account={__owner.account}
                alias={addressAlias}
                sx={{ color: "text.primary" }}
                onCopy={copySuccess}
                length={6}
              />
            </Typography>

            <IsSneedOwner isSneed={isSneed} />
          </Flex>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.apr")}</Typography>

          <Typography color="text.primary">
            {nonUndefinedOrNull(apr) ? (
              <APRPanel value={numToPercent(new BigNumber(apr).dividedBy(100).toString(), 2)} />
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.price.range")}</Typography>

          <Flex vertical gap="7px 0" align="flex-end">
            <PositionPriceRange position={position} />
            <PositionRangeState state={positionState} />
          </Flex>
        </Flex>

        {isOwner && isLimit === false ? (
          <Flex
            fullWidth
            justify="space-between"
            sx={{ padding: "12px 16px", borderRadius: "12px", border: `1px solid ${theme.palette.background.level4}` }}
          >
            <TransferPosition
              position={position}
              positionId={BigInt(positionId)}
              onTransferSuccess={handleTransferSuccess}
            >
              <TextButton sx={{ fontWeight: 500 }}>{t("common.transfer.position")}</TextButton>
            </TransferPosition>

            <Link
              to={`${infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS}?pair=${position.pool.id}${
                principal ? `&principal=${principal?.toString()}` : ""
              }`}
            >
              <Flex gap="0 4px" sx={{ cursor: "pointer" }}>
                <img src="/images/history.svg" alt="" />
                <Typography color="text.secondary" fontSize="12px">
                  {t("common.history")}
                </Typography>
              </Flex>
            </Link>
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
              {t("swap.remove.liquidity")}
            </Button>
            <Button
              variant="contained"
              className="secondary"
              size={matchDownSM ? "small" : "medium"}
              onClick={loadIncreaseLiquidity}
              sx={{ height: "44px" }}
            >
              {t("common.increase.liquidity")}
            </Button>
            {showStakeFarmButton ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleToFarm}
                sx={{ height: "44px" }}
              >
                {t("stake.farm")}
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
            {t("unstake.farm")}
          </Button>
        ) : null}
      </Flex>
    </MainCard>
  );
}
