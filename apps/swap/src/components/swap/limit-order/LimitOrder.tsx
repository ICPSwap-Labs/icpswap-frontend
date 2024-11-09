import { useState, useCallback, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import {
  BigNumber,
  toSignificantWithGroupSeparator,
  nanosecond2Millisecond,
  nonNullArgs,
  isNullArgs,
  parseTokenAmount,
} from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import { Flex } from "@icpswap/ui";
import { ArrowRight } from "react-feather";
import { LimitOrder as LimitOrderType, Null, Override } from "@icpswap/types";
import { TokenImage } from "components/index";
import { usePositionWithPool } from "hooks/swap/usePosition";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import dayjs from "dayjs";
import { useLimitDetails, useCancelLimitCallback } from "hooks/swap/limit-order";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { ReclaimTips } from "components/ReclaimTips";
import StepViewButton from "components/Steps/View";
import { TokenPrice } from "components/swap/index";
import { usePoolById } from "hooks/swap/usePools";

import { CancelLimitConfirm } from "./CancelLimitConfirm";
import { LimitDetails } from "./LimitDetails";

export interface LimitOrderProps {
  onCancelSuccess?: () => void;
  order: Override<LimitOrderType, { poolId: string | Null }>;
}

export function LimitOrder({ order, onCancelSuccess }: LimitOrderProps) {
  const theme = useTheme();

  const [showLimitDetails, setShowLimitDetails] = useState(false);
  const [showLimitConfirm, setShowLimitConfirm] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const { poolId, userPositionId: positionId, timestamp, token0InAmount, token1InAmount, tickLimit } = order;

  const [, pool] = usePoolById(poolId);

  const { result: positionDetails } = usePositionDetailsFromId(poolId, positionId.toString());

  const position = usePositionWithPool({
    pool,
    tickLower: positionDetails?.tickLower,
    tickUpper: positionDetails?.tickUpper,
    liquidity: positionDetails?.liquidity,
  });

  const { inputToken, outputToken, limitPrice, currentPrice } = useLimitDetails({
    position,
    tickLimit,
  });

  const inputAmount = useMemo(() => {
    if (isNullArgs(inputToken)) return null;
    return new BigNumber(token0InAmount.toString()).isEqualTo(0)
      ? parseTokenAmount(token1InAmount, inputToken.decimals).toString()
      : parseTokenAmount(token0InAmount, inputToken.decimals).toString();
  }, [token0InAmount, token1InAmount, inputToken]);

  const outputAmount = useMemo(() => {
    if (nonNullArgs(limitPrice) && nonNullArgs(outputToken) && nonNullArgs(inputAmount)) {
      return new BigNumber(inputAmount).multipliedBy(limitPrice.toFixed(outputToken.decimals)).toString();
    }
  }, [inputAmount, limitPrice, outputToken]);

  const cancelLimit = useCancelLimitCallback();

  const handleCancelLimit = useCallback(async () => {
    if (!position) return;

    const { call, key } = await cancelLimit({
      position,
      poolId: position.pool.id,
      positionId,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
      },
      refresh: () => {
        if (onCancelSuccess) onCancelSuccess();
      },
    });

    const loadingKey = openLoadingTip(t`Cancel Limit Order`, {
      extraContent: <StepViewButton step={key} />,
    });

    await call();

    closeLoadingTip(loadingKey);
  }, [position, positionId, cancelLimit]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  return (
    <>
      <Box sx={{ background: theme.palette.background.level2, padding: "24px", borderRadius: "16px", width: "100%" }}>
        <Typography sx={{ fontSize: "12px" }}>
          <Trans>Created {dayjs(nanosecond2Millisecond(timestamp)).format("MM/DD/YYYY h:mm A")}</Trans>
        </Typography>

        <Flex gap="0 16px" sx={{ margin: "12px 0 0 0" }} fullWidth>
          <Flex gap="0 6px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {inputToken && inputAmount
                ? `${toSignificantWithGroupSeparator(inputAmount.toString())} ${inputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>

          <ArrowRight color="#ffffff" size={16} />

          <Flex gap="0 6px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {outputToken && outputAmount
                ? `${toSignificantWithGroupSeparator(outputAmount)} ${outputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>
        </Flex>

        <Flex
          align="flex-end"
          justify="space-between"
          sx={{
            margin: "24px 0 0 0",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px 0",
            },
          }}
        >
          <Box>
            <Flex gap="0 8px">
              <Typography>
                <Trans>Limit Price</Trans>
              </Typography>
              <Flex gap="0 2px">
                <Typography sx={{ color: "text.primary" }}>
                  {limitPrice
                    ? invertPrice
                      ? `1 ${outputToken.symbol} = ${toSignificantWithGroupSeparator(
                          new BigNumber(1).dividedBy(limitPrice.toFixed()).toString(),
                        )} ${inputToken.symbol}`
                      : `1 ${inputToken.symbol} = ${limitPrice.toFixed()} ${outputToken.symbol}`
                    : "--"}
                </Typography>
                <Box sx={{ width: "20px", height: "20px", cursor: "pointer" }} onClick={handleInvert}>
                  <img src="/images/ck-bridge-switch.svg" style={{ width: "20px", height: "20px" }} alt="" />
                </Box>
              </Flex>
            </Flex>

            <Flex gap="0 8px" sx={{ margin: "10px 0 0 0" }}>
              <Typography>
                <Trans>Current Price</Trans>
              </Typography>

              <TokenPrice
                sx={{ color: "text.primary" }}
                baseToken={inputToken}
                quoteToken={outputToken}
                price={currentPrice?.toFixed()}
                inverted={invertPrice}
              />
            </Flex>
          </Box>

          <Button variant="contained" className="secondary" onClick={() => setShowLimitDetails(true)}>
            <Trans>Cancel</Trans>
          </Button>
        </Flex>
      </Box>

      {position ? (
        <LimitDetails
          open={showLimitDetails}
          position={position}
          order={order}
          onClose={() => {
            setShowLimitDetails(false);
          }}
          onCancelLimit={() => setShowLimitConfirm(true)}
        />
      ) : null}

      <CancelLimitConfirm
        open={showLimitConfirm}
        onClose={() => setShowLimitConfirm(false)}
        onConfirm={() => {
          setShowLimitConfirm(false);
          setShowLimitDetails(false);
          handleCancelLimit();
        }}
      />
    </>
  );
}
