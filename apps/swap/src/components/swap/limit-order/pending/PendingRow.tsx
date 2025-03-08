import { useState, useCallback } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, toSignificantWithGroupSeparator, nanosecond2Millisecond } from "@icpswap/utils";
import { Flex, TextButton } from "@icpswap/ui";
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
import { usePoolByPoolId } from "hooks/swap/usePools";
import { useTranslation } from "react-i18next";
import { CancelLimitConfirm, LimitDetails, LimitDealRatio } from "components/swap/limit-order/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";

export interface PendingRowProps {
  onCancelSuccess?: () => void;
  order: LimitOrderType;
  poolId: string;
  wrapperClasses?: string;
}

export function PendingRow({ wrapperClasses, order, poolId, onCancelSuccess }: PendingRowProps) {
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

  const { inputToken, outputToken, limitPrice, inputAmount, outputAmount } = useLimitDetails({
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
      <Box
        className={wrapperClasses}
        sx={{
          background: theme.palette.background.level3,
          padding: "20px 16px",
          borderRadius: "12px",
          width: "100%",
          "&:hover": {
            background: theme.palette.background.level4,
          },
        }}
      >
        <Flex>
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {dayjs(nanosecond2Millisecond(timestamp)).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Flex>

        <Flex gap="0 6px">
          <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {inputToken && inputAmount
              ? `${toSignificantWithGroupSeparator(inputAmount.toExact())} ${inputToken.symbol}`
              : "--"}
          </Typography>
        </Flex>

        <Flex gap="0 6px">
          <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
          <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
            {outputToken && outputAmount
              ? `${toSignificantWithGroupSeparator(outputAmount.toExact())} ${outputToken.symbol}`
              : "--"}
          </Typography>
        </Flex>

        <Flex gap="0 2px" justify="flex-end">
          <Typography
            sx={{ color: "text.primary", cursor: "pointer", display: "flex", gap: "0 2px", alignItems: "center" }}
            onClick={handleInvert}
          >
            {limitPrice ? (
              <>
                {invertPrice
                  ? `1 ${outputToken.symbol} = ${toSignificantWithGroupSeparator(
                      new BigNumber(1).dividedBy(limitPrice.toFixed(inputToken.decimals)).toString(),
                    )} ${inputToken.symbol}`
                  : `1 ${inputToken.symbol} = ${limitPrice.toFixed(inputToken.decimals)} ${outputToken.symbol}`}
                <SyncAltIcon sx={{ fontSize: "1rem" }} />
              </>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex gap="0 8px" justify="flex-end">
          <LimitDealRatio limit={order} position={position} />
        </Flex>

        <Flex justify="flex-end">
          <TextButton onClick={() => setShowLimitDetails(true)}>{t("common.cancel")}</TextButton>
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
