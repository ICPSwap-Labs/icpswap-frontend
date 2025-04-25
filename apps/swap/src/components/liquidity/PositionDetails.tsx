import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, useMediaQuery, Box, useTheme } from "components/Mui";
import { KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound, LIQUIDITY_OWNER_REFRESH_KEY } from "constants/swap";
import { CurrencyAmountFormatDecimals } from "constants/index";
import {
  BigNumber,
  formatDollarAmount,
  isNullArgs,
  toSignificantWithGroupSeparator,
  formatLiquidityAmount,
} from "@icpswap/utils";
import { CurrencyAmount, Position, Token, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { PositionState } from "utils/index";
import { TokenImage } from "components/index";
import { PositionContext, TransferPosition } from "components/swap/index";
import { isElement } from "react-is";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { RemoveAllLiquidity } from "components/liquidity/RemoveAllLiquidity";
import { useRefreshTriggerManager } from "hooks";

interface PositionDetailItemProps {
  label: React.ReactNode;
  value: React.ReactNode | undefined;
  convert?: boolean;
  onConvertClick?: () => void;
}

function PositionDetailItem({ label, value, convert, onConvertClick }: PositionDetailItemProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Flex fullWidth align={matchDownSM ? "flex-start" : "center"} gap={matchDownSM ? "0px" : "0 12px"}>
      <Typography
        {...(matchDownSM ? { fontSize: "12px" } : {})}
        component="div"
        sx={{ width: "140px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", lineHeight: "14px" }}
      >
        {label}
      </Typography>

      <Flex
        gap="0 4px"
        sx={{
          flex: 1,
          "@media(max-width: 640px)": {
            justifyContent: "flex-end",
          },
        }}
      >
        {isElement(value) ? (
          value
        ) : (
          <Typography {...(matchDownSM ? { fontSize: "12px" } : {})} color="textPrimary" component="div">
            {value}
          </Typography>
        )}

        {convert && <SyncAltIcon sx={{ fontSize: "1rem", cursor: "pointer" }} onClick={onConvertClick} />}
      </Flex>
    </Flex>
  );
}

export interface PositionDetailsProps {
  positionId: bigint;
  showButtons?: boolean;
  position: Position | undefined;
  manuallyInverted: boolean;
  setManuallyInverted: (manuallyInverted: boolean) => void;
  show: boolean | undefined;
  token0USDPrice: number | undefined;
  token1USDPrice: number | undefined;
  positionKey: string | undefined;
  feeUSDValue: string | undefined;
  feeAmount0: CurrencyAmount<Token> | undefined;
  feeAmount1: CurrencyAmount<Token> | undefined;
  onClaimSuccess: () => void;
  onHide: () => void;
  farmId?: string;
  staked?: boolean;
  state: PositionState | undefined;
  isLimit?: boolean;
}

export function PositionDetails({
  position,
  positionId,
  manuallyInverted,
  setManuallyInverted,
  show,
  token0USDPrice,
  token1USDPrice,
  positionKey,
  feeUSDValue,
  feeAmount0,
  feeAmount1,
  onHide,
  farmId,
  staked,
  state,
  isLimit,
}: PositionDetailsProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [transferShow, setTransferShow] = useState(false);

  const { setPositionFees } = useContext(PositionContext);

  const [, setRefreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  useEffect(() => {
    if (!isNullArgs(feeUSDValue) && !isNullArgs(positionKey) && staked !== true && isLimit) {
      setPositionFees(positionKey, new BigNumber(feeUSDValue));
    }
  }, [setPositionFees, positionKey, feeUSDValue, staked, isLimit]);

  const { amount0, amount1, value0, value1 } = useMemo(() => {
    if (!position || isNullArgs(token0USDPrice) || isNullArgs(token1USDPrice)) return {};

    const amount0 = position.amount0.toFixed(CurrencyAmountFormatDecimals(position.amount0.currency.decimals));
    const amount1 = position.amount1.toFixed(CurrencyAmountFormatDecimals(position.amount1.currency.decimals));

    const value0 = new BigNumber(amount0).multipliedBy(token0USDPrice).toString();
    const value1 = new BigNumber(amount1).multipliedBy(token1USDPrice).toString();

    return {
      amount0,
      amount1,
      value0,
      value1,
    };
  }, [position, token0USDPrice, token1USDPrice]);

  const handleStake = useCallback(() => {
    if (!farmId) return;
    history.push(`/farm/details/${farmId}`);
  }, [history, farmId]);

  const handleDetails = useCallback(() => {
    if (!position) return;
    history.push(`/liquidity/position/${String(positionId)}/${position.pool.id}${farmId ? `?farmId=${farmId}` : ""}`);
  }, [position, history, farmId]);

  return (
    <>
      <Box
        sx={{
          display: show ? "block" : "none",
          backgroundColor: theme.palette.background.level2,
          borderRadius: "12px",
          padding: "24px 20px",
          margin: "16px 0 0 0",
        }}
      >
        <Flex
          align="flex-end"
          justify="space-between"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "16px 0",
            },
          }}
        >
          <Flex
            sx={{
              width: "65%",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
            vertical
            gap="16px 0"
          >
            <PositionDetailItem label={t`Position ID`} value={positionId.toString()} />

            <PositionDetailItem
              label={
                <Flex gap="0 4px">
                  <TokenImage
                    logo={currencyQuote?.logo}
                    tokenId={currencyQuote?.address}
                    size={matchDownSM ? "16px" : "20px"}
                  />
                  <Typography
                    sx={{
                      width: "136px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                        width: "116px",
                      },
                    }}
                  >
                    {t("common.amount.with.symbol", { symbol: currencyQuote?.symbol })}
                  </Typography>
                </Flex>
              }
              value={
                inverted ? (
                  <Flex
                    gap="8px"
                    sx={{
                      flex: 1,
                      "@media(max-width: 640px)": {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    <Typography color="text.primary" align="right">
                      {formatLiquidityAmount(amount0)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }} align="right">
                      {value0 ? formatDollarAmount(value0) : "--"}
                    </Typography>
                  </Flex>
                ) : (
                  <Flex
                    gap="8px"
                    sx={{
                      flex: 1,
                      "@media(max-width: 640px)": {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    <Typography color="text.primary">{formatLiquidityAmount(amount1)}</Typography>
                    <Typography sx={{ fontSize: "12px" }}>{value1 ? formatDollarAmount(value1) : "--"}</Typography>
                  </Flex>
                )
              }
            />

            <PositionDetailItem
              label={
                <Flex gap="0 4px">
                  <TokenImage
                    logo={currencyBase?.logo}
                    tokenId={currencyBase?.address}
                    size={matchDownSM ? "16px" : "20px"}
                  />
                  <Typography
                    sx={{
                      width: "136px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                        width: "116px",
                      },
                    }}
                  >
                    {t("common.amount.with.symbol", { symbol: currencyBase?.symbol })}
                  </Typography>
                </Flex>
              }
              value={
                inverted ? (
                  <Flex
                    gap="8px"
                    sx={{
                      flex: 1,
                      "@media(max-width: 640px)": {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    <Typography color="text.primary">{formatLiquidityAmount(amount1)}</Typography>
                    <Typography sx={{ fontSize: "12px" }}>{value1 ? formatDollarAmount(value1) : "--"}</Typography>
                  </Flex>
                ) : (
                  <Flex
                    gap="8px"
                    sx={{
                      flex: 1,
                      "@media(max-width: 640px)": {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    <Typography color="text.primary" align="right">
                      {formatLiquidityAmount(amount0)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }} align="right">
                      {value0 ? formatDollarAmount(value0) : "--"}
                    </Typography>
                  </Flex>
                )
              }
            />

            <PositionDetailItem
              label={t("common.price.range")}
              value={
                <Flex gap="0 4px" onClick={() => setManuallyInverted(!manuallyInverted)}>
                  <Typography
                    sx={{
                      color: "text.primary",
                      textAlign: "right",
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                    component="div"
                  >
                    {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} -
                    {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} {pairName}
                  </Typography>

                  <SyncAltIcon
                    sx={{
                      fontSize: "1rem",
                      cursor: "pointer",
                      color: theme.palette.text.secondary,
                    }}
                  />
                </Flex>
              }
            />

            <PositionDetailItem
              label={t("common.uncollected.fees")}
              value={
                <Flex
                  gap="8px"
                  justify="flex-end"
                  sx={{
                    "@media(max-width: 640px)": {
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                    },
                  }}
                >
                  <Typography
                    color="text.primary"
                    align="right"
                    sx={{
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {!token0 || !token1
                      ? "--"
                      : feeAmount0 !== undefined || feeAmount1 !== undefined
                      ? `${feeAmount0 ? toSignificantWithGroupSeparator(feeAmount0.toExact()) : 0} ${
                          token0.symbol
                        } and ${feeAmount1 ? toSignificantWithGroupSeparator(feeAmount1.toExact()) : 0} ${
                          token1.symbol
                        }`
                      : "--"}
                  </Typography>
                  <Typography
                    align="right"
                    sx={{
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {feeUSDValue ? formatDollarAmount(feeUSDValue) : "--"}
                  </Typography>
                </Flex>
              }
            />
          </Flex>

          <Flex gap="17px" wrap="wrap" justify="flex-end">
            <RemoveAllLiquidity
              position={position}
              positionId={positionId}
              onDecreaseSuccess={() => setRefreshTrigger()}
            />

            {farmId ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "medium" : "large"}
                onClick={handleStake}
              >
                {staked ? t("unstake.farm") : t("stake.farm")}
              </Button>
            ) : null}

            <Button variant="contained" size={matchDownSM ? "medium" : "large"} onClick={handleDetails}>
              {t("liquidity.details")}
            </Button>
          </Flex>
        </Flex>
      </Box>

      {transferShow ? (
        <TransferPosition
          state={state}
          open={transferShow}
          position={position}
          positionId={positionId}
          onClose={() => setTransferShow(false)}
          onTransferSuccess={() => setRefreshTrigger()}
        />
      ) : null}

      <Flex
        sx={{
          height: "0px",
          visibility: "hidden",
          margin: "0 0 0 0",
          "@media(max-width: 640px)": {
            margin: "16px 0 0 0",
            height: "auto",
            visibility: "visible",
            justifyContent: "center",
          },
        }}
        onClick={onHide}
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
          {t("common.hide")}
        </Typography>
        <KeyboardArrowUp
          sx={{
            color: theme.palette.text["theme-secondary"],
          }}
        />
      </Flex>
    </>
  );
}
