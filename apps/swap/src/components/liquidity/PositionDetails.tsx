import React, { useState, useMemo, useEffect } from "react";
import { Typography, Button, useMediaQuery, Box, useTheme } from "components/Mui";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/swap";
import { KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { CurrencyAmountFormatDecimals } from "constants/index";
import {
  BigNumber,
  formatDollarAmount,
  isNullArgs,
  toSignificantWithGroupSeparator,
  formatLiquidityAmount,
  urlStringFormat,
} from "@icpswap/utils";
import { CurrencyAmount, Position, Token } from "@icpswap/swap-sdk";
import { PositionState } from "utils/index";
import { TokenImage } from "components/index";
import { usePositionContext, TransferPosition } from "components/swap/index";
import { isElement } from "react-is";
import { Flex, Link } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { RemoveAllLiquidity } from "components/liquidity/RemoveAllLiquidity";
import { useRefreshTriggerManager } from "hooks";
import { PositionPriceRange } from "components/liquidity/PositionPriceRange";

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
        sx={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          lineHeight: "14px",
          width: "140px",
          "@media(max-width: 640px)": {
            width: "fit-content",
            maxWidth: "140px",
          },
        }}
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
  onHide: () => void;
  farmId?: string;
  staked?: boolean;
  state: PositionState | undefined;
  isLimit?: boolean;
}

export function PositionDetails({
  position,
  positionId,
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
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [transferShow, setTransferShow] = useState(false);

  const { setPositionFees } = usePositionContext();

  const [, setRefreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const { token0, token1 } = position?.pool || {};

  useEffect(() => {
    if (!isNullArgs(feeUSDValue) && !isNullArgs(positionKey) && staked !== true && !isLimit) {
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
              width: "60%",
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
                  <TokenImage logo={token0?.logo} tokenId={token0?.address} size={matchDownSM ? "16px" : "20px"} />
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
                    {t("common.amount.with.symbol", { symbol: token0?.symbol })}
                  </Typography>
                </Flex>
              }
              value={
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
              }
            />

            <PositionDetailItem
              label={
                <Flex gap="0 4px">
                  <TokenImage logo={token1?.logo} tokenId={token1?.address} size={matchDownSM ? "16px" : "20px"} />
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
                    {t("common.amount.with.symbol", { symbol: token1?.symbol })}
                  </Typography>
                </Flex>
              }
              value={
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
              }
            />

            <PositionDetailItem label={t("common.price.range")} value={<PositionPriceRange position={position} />} />

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
            {staked === true ? null : (
              <RemoveAllLiquidity
                position={position}
                positionId={positionId}
                onDecreaseSuccess={() => setRefreshTrigger()}
              />
            )}

            {farmId ? (
              <Link to={`/farm/details/${farmId}`}>
                <Button variant="contained" className="secondary" size={matchDownSM ? "medium" : "large"}>
                  {staked ? t("unstake.farm") : t("stake.farm")}
                </Button>
              </Link>
            ) : null}

            {staked === true ? null : (
              <Link
                to={
                  position
                    ? `/liquidity/increase/${String(positionId)}/${position.pool.id}?path=${urlStringFormat(
                        "/liquidity?tab=Positions",
                      )}`
                    : ""
                }
              >
                <Button variant="contained" className="secondary" size={matchDownSM ? "medium" : "large"}>
                  {t("liquidity.add.more")}
                </Button>
              </Link>
            )}

            <Link
              to={
                position
                  ? `/liquidity/position/${String(positionId)}/${position.pool.id}${farmId ? `?farmId=${farmId}` : ""}`
                  : ""
              }
            >
              <Button variant="contained" size={matchDownSM ? "medium" : "large"}>
                {t("liquidity.details")}
              </Button>
            </Link>
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
