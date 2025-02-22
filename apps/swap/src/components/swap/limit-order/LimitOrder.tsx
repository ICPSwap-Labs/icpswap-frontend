import { useState, useCallback } from "react";
import { Box, Typography, useTheme, Button } from "components/Mui";
import { BigNumber, toSignificantWithGroupSeparator, nanosecond2Millisecond } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { ArrowRight } from "react-feather";
import { LimitOrder as LimitOrderType } from "@icpswap/types";
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
import { usePoolByPoolId } from "hooks/swap/usePools";
import { useTranslation } from "react-i18next";

import { CancelLimitConfirm } from "./CancelLimitConfirm";
import { LimitDetails } from "./LimitDetails";
import { LimitDealRatio } from "./LimitDealRatio";

export interface LimitOrderProps {
  onCancelSuccess?: () => void;
  order: LimitOrderType;
  poolId: string;
}

export function LimitOrder({ order, poolId, onCancelSuccess }: LimitOrderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [showLimitDetails, setShowLimitDetails] = useState(false);
  const [showLimitConfirm, setShowLimitConfirm] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const { userPositionId: positionId, timestamp, tickLimit } = order;

  const [, pool] = usePoolByPoolId(poolId);

  const { result: positionDetails } = usePositionDetailsFromId(poolId, positionId.toString());

  const position = usePositionWithPool({
    pool,
    tickLower: positionDetails?.tickLower,
    tickUpper: positionDetails?.tickUpper,
    liquidity: positionDetails?.liquidity,
  });

  const { inputToken, outputToken, limitPrice, currentPrice, inputAmount, outputAmount } = useLimitDetails({
    position,
    tickLimit,
    limit: order,
  });

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
      limit: order,
    });

    const loadingKey = openLoadingTip(t("limit.cancel.loading.tips"), {
      extraContent: <StepViewButton step={key} />,
    });

    await call();

    closeLoadingTip(loadingKey);
  }, [position, positionId, cancelLimit, order]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  return (
    <>
      <Box sx={{ background: theme.palette.background.level2, padding: "24px", borderRadius: "16px", width: "100%" }}>
        <Typography sx={{ fontSize: "12px" }}>
          {t("common.created.time", { time: dayjs(nanosecond2Millisecond(timestamp)).format("YYYY-MM-DD HH:mm") })}
        </Typography>

        <Flex gap="0 16px" sx={{ margin: "12px 0 0 0" }} fullWidth>
          <Flex gap="0 6px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {inputToken && inputAmount
                ? `${toSignificantWithGroupSeparator(inputAmount.toExact())} ${inputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>

          <ArrowRight color="#ffffff" size={16} />

          <Flex gap="0 6px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {outputToken && outputAmount
                ? `${toSignificantWithGroupSeparator(outputAmount.toExact())} ${outputToken.symbol}`
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
          <Flex vertical fullWidth gap="10px 0" align="flex-start">
            <Flex gap="4px 8px">
              <Typography sx={{ whiteSpace: "nowrap" }}>{t("common.limit.price")}</Typography>
              <Flex gap="0 2px" sx={{ textAlign: "right", cursor: "pointer" }} onClick={handleInvert}>
                <Typography sx={{ color: "text.primary" }}>
                  {limitPrice
                    ? invertPrice
                      ? `1 ${outputToken.symbol} = ${toSignificantWithGroupSeparator(
                          new BigNumber(1).dividedBy(limitPrice.toFixed(inputToken.decimals)).toString(),
                        )} ${inputToken.symbol}`
                      : `1 ${inputToken.symbol} = ${limitPrice.toFixed(inputToken.decimals)} ${outputToken.symbol}`
                    : "--"}
                </Typography>
                <Box sx={{ width: "20px", height: "20px" }}>
                  <img src="/images/ck-bridge-switch.svg" style={{ width: "20px", height: "20px" }} alt="" />
                </Box>
              </Flex>
            </Flex>

            <Flex gap="4px 8px" wrap="wrap">
              <Typography>{t("common.current.price")}</Typography>

              <Flex sx={{ flex: 1, justifyContent: "flex-start" }}>
                <TokenPrice
                  sx={{ color: "text.primary" }}
                  baseToken={inputToken}
                  quoteToken={outputToken}
                  price={currentPrice?.toFixed(outputToken.decimals)}
                  inverted={invertPrice}
                />
              </Flex>
            </Flex>

            <Flex sx={{ margin: "10px 0 0 0" }} gap="0 8px">
              <Typography>Filled</Typography>
              <LimitDealRatio limit={order} position={position} />
            </Flex>
          </Flex>

          <Button variant="contained" className="secondary" onClick={() => setShowLimitDetails(true)}>
            {t("common.cancel")}
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
