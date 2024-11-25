import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, useMediaQuery, Box, useTheme } from "components/Mui";
import { KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { BigNumber, formatDollarAmount, isNullArgs, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { CurrencyAmount, Position, Token, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { toFormat, PositionState } from "utils/index";
import { Trans, t } from "@lingui/macro";
import { TokenImage } from "components/index";
import PositionContext from "components/swap/PositionContext";
import { isElement } from "react-is";
import { Flex } from "@icpswap/ui";
import TransferPosition from "components/swap/TransferPosition";

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
    <Flex fullWidth align={matchDownSM ? "flex-start" : "center"}>
      <Typography {...(matchDownSM ? { fontSize: "12px" } : {})} component="div" sx={{ width: "140px" }}>
        {label}
      </Typography>

      <Flex
        gap="0 4px"
        sx={{
          flex: 1,
          "@media(max-width:640px)": {
            maxWidth: "130px",
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
}: PositionDetailsProps) {
  const history = useHistory();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [transferShow, setTransferShow] = useState(false);

  const { setRefreshTrigger, setPositionFees } = useContext(PositionContext);

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
    if (!isNullArgs(feeUSDValue) && !isNullArgs(positionKey) && staked !== true) {
      setPositionFees(positionKey, new BigNumber(feeUSDValue));
    }
  }, [setPositionFees, positionKey, feeUSDValue, staked]);

  const handleTransferSuccess = () => {
    setRefreshTrigger();
  };

  const { amount0, amount1, value0, value1 } = useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return {};

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
              width: "70%",
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
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    <Trans>{currencyQuote?.symbol} Amount</Trans>
                  </Typography>
                </Flex>
              }
              value={
                inverted ? (
                  <Flex
                    gap="8px"
                    justify="flex-end"
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
                      {toFormat(amount0)}
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
                    <Typography color="text.primary">{toFormat(amount1)}</Typography>
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
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    <Trans>{currencyBase?.symbol} Amount</Trans>
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
                    <Typography color="text.primary">{toFormat(amount1)}</Typography>
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
                      {toFormat(amount0)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }} align="right">
                      {value0 ? formatDollarAmount(value0) : "--"}
                    </Typography>
                  </Flex>
                )
              }
            />

            <PositionDetailItem
              label={t`Price Range`}
              value={
                <Flex
                  gap="0 8px"
                  sx={{
                    "@media(max-width: 640px)": {
                      gap: "0 8px",
                    },
                  }}
                >
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
                    <SyncAltIcon
                      sx={{
                        fontSize: "12px",
                        cursor: "pointer",
                        margin: "0 0 0 4px",
                        color: theme.palette.text.secondary,
                      }}
                      onClick={() => setManuallyInverted(!manuallyInverted)}
                    />
                  </Typography>
                </Flex>
              }
            />

            <PositionDetailItem
              label={t`Uncollected fees`}
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
            {farmId ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "medium" : "large"}
                onClick={handleStake}
              >
                <Trans>Farm Details</Trans>
              </Button>
            ) : null}

            <Button variant="contained" size={matchDownSM ? "medium" : "large"} onClick={handleDetails}>
              <Trans>Position Details</Trans>
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
          onTransferSuccess={handleTransferSuccess}
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
          <Trans>Hide</Trans>
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
