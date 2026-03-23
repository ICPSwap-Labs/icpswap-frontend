import type { Pool } from "@icpswap/swap-sdk";
import type { LimitOrder, Null } from "@icpswap/types";
import { BodyCell, Flex, TableRow, TextButton } from "@icpswap/ui";
import {
  BigNumber,
  formatAmount,
  isUndefinedOrNull,
  nanosecond2Millisecond,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { LoadingRow, TokenImage } from "components/index";
import { Typography, useTheme } from "components/Mui";
import { ReclaimTips } from "components/ReclaimTips";
import StepViewButton from "components/Steps/View";
import { CancelLimitConfirm, LimitDealRatio, LimitDetails } from "components/swap/limit-order/index";
import { LimitAndCurrentPrice } from "components/swap/limit-order/pending/LimitAndCurrentPrice";
import dayjs from "dayjs";
import { usePositionWithPool } from "hooks/swap/index";
import { useCancelLimitCallback, useLimitDetails } from "hooks/swap/limit-order";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { useErrorTip, useLoadingTip } from "hooks/useTips";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ExternalTipArgs } from "types/index";

export interface PendingRowProProps {
  limitOrder: LimitOrder;
  pool: Pool | Null;
  wrapperClassName?: string;
  onCancelSuccess?: () => void;
  noBorder?: boolean;
}

export function PendingRowPro({
  limitOrder,
  pool,
  wrapperClassName,
  onCancelSuccess,
  noBorder = false,
}: PendingRowProProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { userPositionId: positionId, timestamp, token0InAmount, token1InAmount, tickLimit } = limitOrder;

  const [showLimitDetails, setShowLimitDetails] = useState(false);
  const [showLimitConfirm, setShowLimitConfirm] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const { data: positionDetails } = usePositionDetailsFromId(pool?.id, positionId.toString());

  const position = usePositionWithPool({
    pool,
    tickLower: positionDetails?.tickLower,
    tickUpper: positionDetails?.tickUpper,
    liquidity: positionDetails?.liquidity,
  });

  const { inputToken, outputToken, limitPrice } = useLimitDetails({
    position,
    tickLimit,
    limit: limitOrder,
  });

  const inputAmount = useMemo(() => {
    if (isUndefinedOrNull(inputToken)) return null;
    return new BigNumber(token0InAmount.toString()).isEqualTo(0)
      ? parseTokenAmount(token1InAmount, inputToken.decimals).toString()
      : parseTokenAmount(token0InAmount, inputToken.decimals).toString();
  }, [token0InAmount, token1InAmount, inputToken]);

  const outputAmount = useMemo(() => {
    if (nonUndefinedOrNull(limitPrice) && nonUndefinedOrNull(outputToken) && nonUndefinedOrNull(inputAmount)) {
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
      limit: limitOrder,
    });

    const loadingKey = openLoadingTip(t("limit.cancel.loading.tips"), {
      extraContent: <StepViewButton step={key} />,
    });

    await call();

    closeLoadingTip(loadingKey);
  }, [
    position,
    positionId,
    limitOrder,
    cancelLimit,
    closeLoadingTip,
    onCancelSuccess,
    openErrorTip,
    openLoadingTip,
    t,
  ]);

  return (
    <>
      {pool ? (
        <TableRow
          className={wrapperClassName}
          borderBottom={noBorder ? "none!important" : `1px solid ${theme.palette.border.level1}`}
        >
          <BodyCell>{dayjs(nanosecond2Millisecond(timestamp)).format("YYYY-MM-DD HH:mm")}</BodyCell>

          {/* You pay */}
          <BodyCell sx={{ gap: "0 6px", alignItems: "center" }}>
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {inputToken && inputAmount ? `${formatAmount(inputAmount.toString())} ${inputToken.symbol}` : "--"}
            </Typography>
          </BodyCell>

          {/* You receive */}
          <BodyCell sx={{ gap: "0 6px", alignItems: "center" }}>
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {outputToken && outputAmount ? `${formatAmount(outputAmount)} ${outputToken.symbol}` : "--"}
            </Typography>
          </BodyCell>

          {/* Limit Price */}
          <BodyCell
            sx={{ justifyContent: "flex-end", alignItems: "center", gap: "0 4px" }}
            onClick={() => setInvertPrice(!invertPrice)}
          >
            <Flex vertical align="flex-end">
              <LimitAndCurrentPrice
                inputToken={inputToken}
                outputToken={outputToken}
                limitPrice={limitPrice}
                pool={pool}
              />
            </Flex>
          </BodyCell>

          {/* Filled */}
          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <LimitDealRatio position={position} limit={limitOrder} width="60px" />
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <TextButton onClick={() => setShowLimitDetails(true)}>{t("common.cancel")}</TextButton>
          </BodyCell>
        </TableRow>
      ) : (
        <TableRow>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </TableRow>
      )}

      {position ? (
        <LimitDetails
          open={showLimitDetails}
          position={position}
          order={limitOrder}
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
