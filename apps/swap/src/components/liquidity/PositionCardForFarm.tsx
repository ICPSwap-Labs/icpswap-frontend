import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { Typography, useMediaQuery, Box, makeStyles, useTheme, Theme } from "components/Mui";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { usePositionFees } from "hooks/swap/usePositionFees";
import {
  BigNumber,
  formatDollarAmount,
  isNullArgs,
  nonNullArgs,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { CurrencyAmount, Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { FeeTierPercentLabel, Flex, APRPanel } from "@icpswap/ui";
import { useFarmState, useFarmInitArgs, useFarmUserPositions, useSwapPoolMetadata } from "@icpswap/hooks";
import { type FarmInfoWithId } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { Loading } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import PositionContext from "components/swap/PositionContext";
import { FarmStateChip } from "components/farm/index";
import { encodePositionKey, PositionState } from "utils/swap/index";
import { PositionRangeState } from "components/swap/index";
import { PositionFilterState, PositionSort } from "types/swap";
import { useGlobalContext, useRefreshTrigger, useToken } from "hooks/index";
import {
  usePositionState,
  usePositionValue,
  usePositionFeesValue,
  useLoadLiquidityPageCallback,
} from "hooks/liquidity";
import { useFarmUserRewardAmountAndValue, useUserApr, useFarmTvlValue } from "hooks/staking-farm/index";
import { usePositionsValueByInfos } from "hooks/swap/index";
import { useAccountPrincipal } from "store/auth/hooks";

import { PositionDetails } from "./PositionDetails";

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
  state: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    background: "#8492C4",

    "@media(max-width: 640px)": {
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "0px",
      borderTopRightRadius: "12px",
    },

    "&.level0": {
      background: "#FFD24C",
    },

    "&.level1": {
      background: "#D3625B",
    },

    "&.outOfRange": {
      background: "#9D332C",
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
}

export function PositionCardForFarm({
  position,
  showButtons,
  positionId,
  staked,
  filterState,
  farmInfo,
}: PositionCardForFarmProps) {
  const classes = useStyle();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const principal = useAccountPrincipal();

  const [detailShow, setDetailShow] = useState<boolean | undefined>(undefined);
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { setAllPositionsUSDValue, setHiddenNumbers } = useContext(PositionContext);
  const { refreshTriggers, setRefreshTriggers } = useGlobalContext();

  const positionKey = useMemo(() => {
    if (!position) return undefined;
    return encodePositionKey(position, positionId);
  }, [position, positionId]);

  const refreshTrigger = useRefreshTrigger(positionKey);

  const handleToggleShow = useCallback(() => {
    if (!position) return;
    setDetailShow(!detailShow);
  }, [detailShow, setDetailShow, position]);

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

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(
    position?.pool.id,
    positionId,
    positionKey ? refreshTriggers[positionKey] : undefined,
  );

  const { currencyFeeAmount0, currencyFeeAmount1 } = useMemo(() => {
    if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(feeAmount0) || isNullArgs(feeAmount1)) return {};

    const currencyFeeAmount0 = CurrencyAmount.fromRawAmount(token0, feeAmount0.toString());
    const currencyFeeAmount1 = CurrencyAmount.fromRawAmount(token1, feeAmount1.toString());

    return {
      currencyFeeAmount0,
      currencyFeeAmount1,
    };
  }, [feeAmount0, feeAmount1, token0, token1]);

  const feeUSDValue = usePositionFeesValue({ position, feeAmount0, feeAmount1 });

  useEffect(() => {
    if (nonNullArgs(totalUSDValue) && nonNullArgs(positionKey)) {
      setAllPositionsUSDValue(positionKey, new BigNumber(totalUSDValue));
    }
  }, [totalUSDValue, positionKey, staked]);

  const handleClaimSuccess = useCallback(() => {
    if (positionKey) {
      setRefreshTriggers(positionKey);
    }
  }, [setRefreshTriggers, positionKey]);

  const displayByFilter = useMemo(() => {
    if (isNullArgs(positionState)) return true;

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

  const { result: farmInitArgs } = useFarmInitArgs(farmInfo.id);
  const [, rewardToken] = useToken(farmInfo.rewardToken.address);
  const { result: deposits } = useFarmUserPositions(farmInfo.id, principal?.toString(), refreshTrigger);
  const { result: swapPoolMetadata } = useSwapPoolMetadata(farmInfo?.pool.toString());

  const stakedPositionsInfo = useMemo(() => {
    if (!deposits) return undefined;

    return deposits.map((ele) => ({
      liquidity: ele.liquidity,
      tickUpper: ele.tickUpper,
      tickLower: ele.tickLower,
    }));
  }, [deposits]);

  const stakedPositionValue = usePositionsValueByInfos({
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

  const userApr = useUserApr({
    farmInitArgs,
    rewardToken,
    rewardAmount: userRewardAmount,
    state: farmState,
    farmTvlValue,
    positionValue: stakedPositionValue,
    deposits,
  });

  const loadLiquidityPage = useLoadLiquidityPageCallback({ poolId: pool?.id, positionId, page: "position" });

  const handleToPositionDetails = useCallback(() => {
    if (!position || matchDownMD) return;
    loadLiquidityPage();
  }, [detailShow, setDetailShow, position, matchDownMD, loadLiquidityPage]);

  return (
    <Box
      className={classes.wrapper}
      sx={{
        display: displayByFilter ? "block" : "none",
      }}
    >
      <Box className={`${classes.state} ${positionState ?? ""}}`} />

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
          if (matchDownMD) {
            handleToggleShow();
          } else {
            handleToPositionDetails();
          }
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
            <Typography className={classes.label}>
              <Trans>Reward Token</Trans>
            </Typography>

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
            <Typography className={classes.label}>
              <Trans>APR</Trans>
            </Typography>

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
              <Typography className={classes.label}>
                <Trans>Value</Trans>
              </Typography>

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
            <Typography className={classes.label}>
              <Trans>Uncollected Fees</Trans>
            </Typography>

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
                <Trans>Detail</Trans>
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
          onClaimSuccess={handleClaimSuccess}
          onHide={() => setDetailShow(false)}
          staked={staked}
          state={positionState}
        />
      </Box>
    </Box>
  );
}
