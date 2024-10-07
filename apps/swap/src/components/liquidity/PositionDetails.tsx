import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button, useMediaQuery, Box, useTheme } from "components/Mui";
import { KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { CollectFeesModal } from "components/swap/CollectFeesModal";
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
  label: React.ReactChild;
  value: React.ReactChild | undefined;
  convert?: boolean;
  onConvertClick?: () => void;
}

function PositionDetailItem({ label, value, convert, onConvertClick }: PositionDetailItemProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Flex fullWidth justify="space-between" align="flex-start">
      <Typography {...(matchDownSM ? { fontSize: "12px" } : {})} component="div">
        {label}
      </Typography>

      <Flex
        justify="flex-end"
        gap="0 4px"
        sx={{
          "@media(max-width:640px)": {
            maxWidth: "130px",
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
  showButtons,
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
  onClaimSuccess,
  onHide,
  farmId,
  staked,
  state,
}: PositionDetailsProps) {
  const history = useHistory();
  const theme = useTheme();

  const [collectFeesShow, setCollectFeesShow] = useState(false);
  const [transferShow, setTransferShow] = useState(false);

  const { setRefreshTrigger, setPositionFees } = useContext(PositionContext);

  const noLiquidity = position?.liquidity.toString() === "0";

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

  const hasUnclaimedFees = useMemo(() => {
    if (!feeAmount0 && !feeAmount1) return false;
    return true;
  }, [feeAmount0, feeAmount1]);

  const feeIsZero = useMemo(() => {
    if (!feeAmount0 || !feeAmount1) return true;
    return new BigNumber(feeAmount0.toExact()).plus(feeAmount1.toExact()).isEqualTo(0);
  }, [feeAmount0, feeAmount1]);

  useEffect(() => {
    if (!isNullArgs(feeUSDValue) && !isNullArgs(positionKey) && staked !== true) {
      setPositionFees(positionKey, new BigNumber(feeUSDValue));
    }
  }, [setPositionFees, positionKey, feeUSDValue, staked]);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTransferSuccess = () => {
    setRefreshTrigger();
  };

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

  const handleLoadRemoveLiquidity = useCallback(() => {
    if (!position) return;
    history.push(`/liquidity/decrease/${String(positionId)}/${position.pool.id}`);
  }, [history, positionId, position]);

  const handleLoadIncreaseLiquidity = useCallback(() => {
    if (!position) return;
    history.push(`/liquidity/increase/${String(positionId)}/${position.pool.id}`);
  }, [positionId, position]);

  const handleCollectFee = useCallback(() => {
    setCollectFeesShow(true);
  }, [setCollectFeesShow]);

  const handleTransferPosition = useCallback(() => {
    setTransferShow(true);
  }, [setTransferShow]);

  const handleStake = useCallback(() => {
    if (!farmId) return;
    history.push(`/farm/details/${farmId}`);
  }, [history, farmId]);

  const handleUnStake = useCallback(() => {
    if (!farmId) return;
    history.push(`/farm/details/${farmId}`);
  }, [history, farmId]);

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
          align="flex-start"
          gap="0 66px"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "16px 0",
            },
          }}
        >
          <Flex
            sx={{
              flex: "50%",
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
                  <Box>
                    <Typography color="text.primary" align="right">
                      {toFormat(amount0)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }} align="right">
                      {value0 ? formatDollarAmount(value0) : "--"}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography color="text.primary" align="right">
                      {toFormat(amount1)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }} align="right">
                      {value1 ? formatDollarAmount(value1) : "--"}
                    </Typography>
                  </Box>
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
                  <Box>
                    <Typography color="text.primary" align="right">
                      {toFormat(amount1)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }} align="right">
                      {value1 ? formatDollarAmount(value1) : "--"}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography color="text.primary" align="right">
                      {toFormat(amount0)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }} align="right">
                      {value0 ? formatDollarAmount(value0) : "--"}
                    </Typography>
                  </Box>
                )
              }
            />
          </Flex>

          {matchDownSM ? null : (
            <Box sx={{ width: "1px", height: "100%", minHeight: "120px", background: "#242E54" }} />
          )}

          <Flex
            sx={{
              flex: "50%",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
            vertical
            gap="16px 0"
          >
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
                <Box>
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
                    mt="5px"
                    align="right"
                    sx={{
                      "@media(max-width: 640px)": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {feeUSDValue ? formatDollarAmount(feeUSDValue) : "--"}
                  </Typography>
                </Box>
              }
            />
          </Flex>
        </Flex>

        {showButtons && (
          <Flex
            sx={{
              margin: "32px 0 0 0",
              gap: "0 8px",
              flexWrap: "wrap",
              "@media(max-width: 640px)": {
                flexWrap: "wrap",
                gap: "12px 8px",
              },
            }}
            justify="flex-end"
          >
            {staked ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleUnStake}
              >
                <Trans>Unstake</Trans>
              </Button>
            ) : null}
            {!staked && farmId ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleStake}
              >
                <Trans>Stake</Trans>
              </Button>
            ) : null}
            {!noLiquidity && !staked ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleLoadRemoveLiquidity}
              >
                <Trans>Remove Liquidity</Trans>
              </Button>
            ) : null}

            {hasUnclaimedFees && !staked ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleCollectFee}
                disabled={feeIsZero}
              >
                <Trans>Collect Fees</Trans>
              </Button>
            ) : null}

            {!staked ? (
              <Button
                variant="contained"
                className="secondary"
                size={matchDownSM ? "small" : "medium"}
                onClick={handleTransferPosition}
              >
                <Trans>Transfer Position</Trans>
              </Button>
            ) : null}

            {!staked ? (
              <Button variant="contained" size={matchDownSM ? "small" : "medium"} onClick={handleLoadIncreaseLiquidity}>
                <Trans>Increase Liquidity</Trans>
              </Button>
            ) : null}
          </Flex>
        )}
      </Box>

      <CollectFeesModal
        open={collectFeesShow}
        pool={pool}
        positionId={positionId}
        currencyFeeAmount0={feeAmount0}
        currencyFeeAmount1={feeAmount1}
        onClose={() => {
          setCollectFeesShow(false);
        }}
        onClaimedSuccessfully={onClaimSuccess}
      />

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
