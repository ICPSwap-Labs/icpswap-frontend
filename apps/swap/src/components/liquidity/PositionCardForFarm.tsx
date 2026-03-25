import { useFarmInitArgs, useFarmState, useFarmUserPositions, useSwapPoolMetadata } from "@icpswap/hooks";
import { CurrencyAmount, getPriceOrderingFromPositionForUI, type Position, useInverter } from "@icpswap/swap-sdk";
import type { FarmInfoWithId } from "@icpswap/types";
import { APRPanel, FeeTierPercentLabel, Flex } from "@icpswap/ui";
import {
  BigNumber,
  formatDollarAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { CurrenciesAvatar } from "components/CurrenciesAvatar";
import { FarmStateChip } from "components/farm/index";
import { Loading } from "components/index";
import { LiquidityStateFlag } from "components/liquidity/LiquidityStateFlag";
import { PositionDetails } from "components/liquidity/PositionDetails";
import { Box, makeStyles, type Theme, Typography, useTheme } from "components/Mui";
import { PositionRangeState, usePositionContext } from "components/swap/index";
import { useRefreshTrigger, useToken } from "hooks/index";
import { usePositionFeesValue, usePositionState, usePositionValue } from "hooks/liquidity";
import { useFarmTvlValue, useFarmUserRewardAmountAndValue, useUserSingleLiquidityApr } from "hooks/staking-farm/index";
import { usePositionsTotalValue } from "hooks/swap/index";
import { useMediaQueryMD } from "hooks/theme";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { PositionFilterState, type PositionSort } from "types/swap";
import { encodePositionKey, PositionState } from "utils/swap/index";

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    width: "100%",
    position: "relative",
    backgroundColor: theme.palette.background.level1,
    borderRadius: `12px`,
    padding: "16px 24px",
    margin: "8px 0 0 0",
    cursor: "pointer",
    overflow: "hidden",

    "&:first-child": {
      marginTop: "0",
    },

    [theme.breakpoints.down("md")]: {
      padding: "16px 24px",
    },

    "@media(max-width: 640px)": {
      margin: "12px 0 0 0",
      padding: "16px 12px",
    },
  },

  item: {
    flexDirection: "column",
    gap: "8px 0",
    alignItems: "flex-start",
    "@media(max-width: 640px)": {
      flexDirection: "row",
      gap: "0 4px",
      alignItems: "center",
    },
  },

  label: {
    whiteSpace: "nowrap",
    width: "fit-content",
    fontSize: "12px",
    textAlign: "left",
    "@media(min-width: 640px)": {
      width: "100%",
      justifyContent: "flex-end",
      textAlign: "right",
    },
  },
}));

export interface PositionCardForFarmProps {
  positionId: bigint;
  showButtons?: boolean;
  position: Position | undefined;
  staked?: boolean;
  filterState: PositionFilterState;
  sort: PositionSort;
  farmInfo: FarmInfoWithId;
  fee: { fee0: bigint; fee1: bigint } | undefined;
}

export function PositionCardForFarm({
  position,
  showButtons,
  positionId,
  staked,
  filterState,
  farmInfo,
  fee,
}: PositionCardForFarmProps) {
  const { t } = useTranslation();
  const classes = useStyle();
  const theme = useTheme();
  const matchDownMD = useMediaQueryMD();
  const principal = useAccountPrincipal();

  const [detailShow, setDetailShow] = useState<boolean | undefined>(undefined);
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { setAllPositionsUSDValue, setHiddenNumbers } = usePositionContext();

  const positionKey = useMemo(() => {
    if (!position) return undefined;
    return encodePositionKey(position, positionId);
  }, [position, positionId]);

  const refreshTrigger = useRefreshTrigger(positionKey);

  const handleToggleShow = useCallback(() => {
    if (!position) return;
    setDetailShow(!detailShow);
  }, [detailShow, position]);

  const pool = position?.pool;
  const { token0, token1, fee: feeAmount } = pool || {};

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;
  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const positionState = usePositionState(position);
  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  const totalUSDValue = usePositionValue({ position });

  const { fee0: feeAmount0, fee1: feeAmount1 } = useMemo(() => {
    if (!fee) return { fee0: undefined, fee1: undefined };
    return fee;
  }, [fee]);

  const { currencyFeeAmount0, currencyFeeAmount1 } = useMemo(() => {
    if (
      isUndefinedOrNull(token0) ||
      isUndefinedOrNull(token1) ||
      isUndefinedOrNull(feeAmount0) ||
      isUndefinedOrNull(feeAmount1)
    )
      return {};

    const currencyFeeAmount0 = CurrencyAmount.fromRawAmount(token0, feeAmount0.toString());
    const currencyFeeAmount1 = CurrencyAmount.fromRawAmount(token1, feeAmount1.toString());

    return {
      currencyFeeAmount0,
      currencyFeeAmount1,
    };
  }, [feeAmount0, feeAmount1, token0, token1]);

  const feeUSDValue = usePositionFeesValue({ position, feeAmount0, feeAmount1 });

  useEffect(() => {
    if (nonUndefinedOrNull(totalUSDValue) && nonUndefinedOrNull(positionKey)) {
      setAllPositionsUSDValue(positionKey, new BigNumber(totalUSDValue));
    }
  }, [totalUSDValue, positionKey, setAllPositionsUSDValue]);

  const displayByFilter = useMemo(() => {
    if (isUndefinedOrNull(positionState)) return true;

    switch (filterState) {
      case PositionFilterState.All:
        return true;
      case PositionFilterState.Closed:
        return positionState === PositionState.CLOSED;
      case PositionFilterState.OutOfRanges:
        return positionState === PositionState.OutOfRange;
      case PositionFilterState.InRanges:
        return positionState !== PositionState.CLOSED && positionState !== PositionState.OutOfRange;
      default:
        return true;
    }
  }, [positionState, filterState]);

  useEffect(() => {
    if (positionKey) {
      setHiddenNumbers(`${positionKey}_FARM`, !displayByFilter);
    }
  }, [displayByFilter, setHiddenNumbers, positionKey]);

  const { data: farmInitArgs } = useFarmInitArgs(farmInfo.id);
  const [, rewardToken] = useToken(farmInfo.rewardToken.address);
  const { data: deposits } = useFarmUserPositions(farmInfo.id, principal?.toString(), refreshTrigger);
  const { data: swapPoolMetadata } = useSwapPoolMetadata(farmInfo?.pool.toString());

  const deposit = useMemo(() => {
    if (!deposits || isUndefinedOrNull(positionId)) return undefined;

    return deposits.filter((e) => e.positionId === positionId)[0];
  }, [deposits, positionId]);

  const stakedPositionsInfo = useMemo(() => {
    if (!deposit) return undefined;

    return [deposit].map((ele) => ({
      liquidity: ele.liquidity,
      tickUpper: ele.tickUpper,
      tickLower: ele.tickLower,
    }));
  }, [deposit]);

  const stakedPositionValue = usePositionsTotalValue({
    metadata: swapPoolMetadata,
    positionInfos: stakedPositionsInfo,
  });

  const farmState = useFarmState(farmInfo);

  const { userRewardAmount, userRewardValue } = useFarmUserRewardAmountAndValue({
    farmId: farmInfo.id,
    positionIds: [positionId],
    refresh: refreshTrigger,
    farmInitArgs,
    rewardToken,
  });

  const farmTvlValue = useFarmTvlValue({ farmId: farmInfo.id, token0, token1 });

  const userApr = useUserSingleLiquidityApr({
    farmInitArgs,
    rewardToken,
    rewardAmount: userRewardAmount,
    state: farmState,
    farmTvlValue,
    positionValue: stakedPositionValue,
    deposit,
  });

  return (
    <Box
      className={classes.wrapper}
      sx={{
        display: displayByFilter ? "block" : "none",
      }}
    >
      <LiquidityStateFlag position={position} />

      <Flex
        justify="space-between"
        fullWidth
        sx={{
          "@media(max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "18px 0",
          },
        }}
        onClick={() => {
          handleToggleShow();
        }}
      >
        {!position && <Loading loading={!position} circularSize={28} />}

        <Flex gap="0 8px">
          <CurrenciesAvatar
            currencyA={currencyBase}
            currencyB={currencyQuote}
            borderColor="rgba(189, 200, 240, 0.4)"
            bgColor="#273155"
            size="28px"
          />

          <Typography color="textPrimary" fontSize="18px">
            {currencyBase?.symbol}/{currencyQuote?.symbol}
          </Typography>

          <FeeTierPercentLabel feeTier={feeAmount} />

          <FarmStateChip farmInfo={farmInfo} />
        </Flex>

        <Flex
          gap="0 32px"
          sx={{
            "@media(max-width: 640px)": {
              gap: "14px 0",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            },
          }}
        >
          <Flex className={classes.item} sx={{ width: "240px", "@media(max-width: 640px)": { width: "100%" } }}>
            <Typography className={classes.label}>{t("common.reward.token")}</Typography>

            <Flex
              gap="0 4px"
              fullWidth
              justify="flex-end"
              wrap="nowrap"
              sx={{
                "@media(max-width: 640px)": { width: "fit-content" },
              }}
            >
              <Typography color="text.primary">
                {userRewardAmount && rewardToken
                  ? `${toSignificantWithGroupSeparator(userRewardAmount)} ${rewardToken.symbol}`
                  : "--"}
              </Typography>
              <Typography>({userRewardValue ? formatDollarAmount(userRewardValue) : "--"})</Typography>
            </Flex>
          </Flex>

          <Flex className={classes.item} sx={{ width: "70px", "@media(max-width: 640px)": { width: "fit-content" } }}>
            <Typography className={classes.label}>{t("common.apr")}</Typography>

            <Flex
              fullWidth
              justify="flex-end"
              sx={{
                "@media(max-width: 640px)": { width: "fit-content" },
              }}
            >
              {userApr ? <APRPanel value={userApr} /> : <Typography color="text.primary">--</Typography>}
            </Flex>
          </Flex>

          {positionState !== PositionState.CLOSED ? (
            <Flex
              className={classes.item}
              justify="flex-end"
              sx={{ width: "80px", "@media(max-width: 640px)": { width: "fit-content" } }}
            >
              <Typography className={classes.label}>{t("common.value")}</Typography>

              <Flex
                fullWidth
                justify="flex-end"
                sx={{
                  "@media(max-width: 640px)": { width: "fit-content" },
                }}
              >
                <Typography color="text.primary">{totalUSDValue ? formatDollarAmount(totalUSDValue) : "--"}</Typography>
              </Flex>
            </Flex>
          ) : null}

          <Flex
            className={classes.item}
            justify="flex-end"
            sx={{ width: "110px", "@media(max-width: 640px)": { width: "fit-content" } }}
          >
            <Typography className={classes.label}>{t("common.uncollected.fees")}</Typography>

            <Flex fullWidth justify="flex-end">
              <Typography color="text.primary">{feeUSDValue ? formatDollarAmount(feeUSDValue) : "--"}</Typography>
            </Flex>
          </Flex>

          <PositionRangeState state={positionState} width="110px" />

          {matchDownMD ? (
            <Flex
              sx={{
                "@media(max-width: 640px)": {
                  width: "100%",
                  justifyContent: "center",
                  visibility: detailShow ? "hidden" : "visible",
                  height: detailShow ? "0px" : "auto",
                },
              }}
            >
              <Typography
                sx={{
                  display: "none",
                  fontSize: "12px",
                  "@media(max-width: 640px)": {
                    display: "block",
                  },
                }}
                color="text.theme-secondary"
              >
                {t("common.details")}
              </Typography>

              {detailShow ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown
                  sx={{
                    color: matchDownMD ? theme.palette.text["theme-secondary"] : theme.palette.text.secondary,
                  }}
                />
              )}
            </Flex>
          ) : (
            <Flex
              sx={{
                justifyContent: "flex-end",
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleToggleShow();
              }}
            >
              {detailShow ? (
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    background: theme.palette.background.level4,
                    borderRadius: "50%",
                  }}
                >
                  <KeyboardArrowUp />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    background: theme.palette.background.level4,
                    borderRadius: "50%",
                  }}
                >
                  <KeyboardArrowDown
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  />
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Box sx={{ display: detailShow === true ? "block" : "none" }}>
        <PositionDetails
          farmId={farmInfo.id}
          position={position}
          positionId={positionId}
          showButtons={showButtons}
          manuallyInverted={manuallyInverted}
          setManuallyInverted={setManuallyInverted}
          show={detailShow}
          token0USDPrice={token0USDPrice}
          token1USDPrice={token1USDPrice}
          positionKey={positionKey}
          feeUSDValue={feeUSDValue}
          feeAmount0={currencyFeeAmount0}
          feeAmount1={currencyFeeAmount1}
          onHide={() => setDetailShow(false)}
          staked={staked}
          state={positionState}
        />
      </Box>
    </Box>
  );
}
