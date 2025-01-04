import { Pool } from "@icpswap/swap-sdk";
import { TableRow, BodyCell, TextButton } from "@icpswap/ui";
import { LoadingRow, TokenImage } from "components/index";
import { usePositionWithPool } from "hooks/swap/index";
import { LimitOrder, Null } from "@icpswap/types";
import { Trans, t } from "@lingui/macro";
import { useState, useCallback, useMemo } from "react";
import { Typography, useTheme } from "components/Mui";
import {
  nanosecond2Millisecond,
  nonNullArgs,
  isNullArgs,
  parseTokenAmount,
  BigNumber,
  formatTokenPrice,
  formatAmount,
} from "@icpswap/utils";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import dayjs from "dayjs";
import { useLimitDetails, useCancelLimitCallback } from "hooks/swap/limit-order";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { ReclaimTips } from "components/ReclaimTips";
import StepViewButton from "components/Steps/View";

import { CancelLimitConfirm } from "./CancelLimitConfirm";
import { LimitDetails } from "./LimitDetails";

export interface LimitOrderRowProps {
  limitOrder: LimitOrder;
  pool: Pool | Null;
  wrapperClassName?: string;
  onCancelSuccess?: () => void;
  noBorder?: boolean;
}

export function LimitOrderRow({
  limitOrder,
  pool,
  wrapperClassName,
  onCancelSuccess,
  noBorder = false,
}: LimitOrderRowProps) {
  const theme = useTheme();

  const { userPositionId: positionId, timestamp, token0InAmount, token1InAmount, tickLimit } = limitOrder;

  const [showLimitDetails, setShowLimitDetails] = useState(false);
  const [showLimitConfirm, setShowLimitConfirm] = useState(false);
  const [invertPrice] = useState(false);
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const { result: positionDetails } = usePositionDetailsFromId(pool?.id, positionId.toString());

  const position = usePositionWithPool({
    pool,
    tickLower: positionDetails?.tickLower,
    tickUpper: positionDetails?.tickUpper,
    liquidity: positionDetails?.liquidity,
  });

  const { inputToken, outputToken, limitPrice } = useLimitDetails({
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

  return (
    <>
      {pool ? (
        <TableRow
          className={wrapperClassName}
          borderBottom={noBorder ? "none!important" : `1px solid ${theme.palette.border.level1}`}
        >
          <BodyCell>{dayjs(nanosecond2Millisecond(timestamp)).format("YYYY-MM-DD HH:mm")}</BodyCell>

          {/* You pay */}
          <BodyCell sx={{ gap: "0 6px" }}>
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {inputToken && inputAmount ? `${formatAmount(inputAmount.toString())} ${inputToken.symbol}` : "--"}
            </Typography>
          </BodyCell>

          {/* You receive */}
          <BodyCell sx={{ gap: "0 6px" }}>
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {outputToken && outputAmount ? `${formatAmount(outputAmount)} ${outputToken.symbol}` : "--"}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <Typography sx={{ color: "text.primary" }}>
              {limitPrice
                ? invertPrice
                  ? `1 ${outputToken.symbol} = ${formatTokenPrice(
                      new BigNumber(1).dividedBy(limitPrice.toFixed(inputToken.decimals)).toString(),
                    )} ${inputToken.symbol}`
                  : `1 ${inputToken.symbol} = ${formatTokenPrice(limitPrice.toFixed(inputToken.decimals))} ${
                      outputToken.symbol
                    }`
                : "--"}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ justifyContent: "flex-end" }}>
            <TextButton onClick={() => setShowLimitDetails(true)}>
              <Trans>Cancel</Trans>
            </TextButton>
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
          order={{ ...limitOrder, poolId: pool?.id }}
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
