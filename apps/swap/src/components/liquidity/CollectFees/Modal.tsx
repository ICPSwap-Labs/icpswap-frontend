import { Box, Typography, CircularProgress, useTheme } from "components/Mui";
import { TokenImage, Modal, Flex, AuthButton } from "components/index";
import { isNullArgs, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { CurrencyAmount, Position } from "@icpswap/swap-sdk";
import { useMemo, useState } from "react";
import { useCollectFeeCallback } from "hooks/swap/useClaimFees";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import StepViewButton from "components/Steps/View";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { useTranslation } from "react-i18next";

export interface CollectFeeModalProps {
  open: boolean;
  onClose: () => void;
  position: Position | undefined | null;
  positionId: number | bigint | undefined | string;
  onCollectSuccess?: () => void;
}

export function CollectFeesModal({ open, onClose, position, positionId, onCollectSuccess }: CollectFeeModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [loading, setLoading] = useState(false);

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(position?.pool.id, positionId);

  const pool = position?.pool;

  const { token0, token1 } = useMemo(() => {
    if (!pool) return { token0: undefined, token1: undefined };
    return { token0: pool.token0, token1: pool.token1 };
  }, [pool]);

  const getClaimFeeCall = useCollectFeeCallback();

  const handleCollect = async () => {
    if (loading || !positionId || !pool || !position || isNullArgs(feeAmount0) || isNullArgs(feeAmount1)) return;

    const { token0, token1 } = pool;

    setLoading(true);
    onClose();

    const { call, key } = getClaimFeeCall({
      pool,
      positionId: BigInt(positionId),
      currencyFeeAmount0: CurrencyAmount.fromRawAmount(pool.token0, feeAmount0.toString()),
      currencyFeeAmount1: CurrencyAmount.fromRawAmount(pool.token1, feeAmount1.toString()),
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} poolId={poolId} tokenId={tokenId} />);
      },
      refresh: () => {
        if (onCollectSuccess) onCollectSuccess();
      },
    });

    const loadingTipKey = openLoadingTip(
      `Collect ${toSignificantWithGroupSeparator(
        parseTokenAmount(feeAmount0.toString(), token0.decimals).toString(),
      )} ${token0.symbol} and ${toSignificantWithGroupSeparator(
        parseTokenAmount(feeAmount1.toString(), token1.decimals).toString(),
      )} ${token1.symbol}`,
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    const result = await call();

    if (result === true) {
      openSuccessTip(t("swap.collect.success"));
    }

    closeLoadingTip(loadingTipKey);
    setLoading(false);
  };

  const disabled = useMemo(() => {
    if (isNullArgs(feeAmount0) || isNullArgs(feeAmount1)) return true;

    return feeAmount0 === BigInt(0) && feeAmount1 === BigInt(0);
  }, [feeAmount0, feeAmount1]);

  return (
    <Modal open={open} onClose={onClose} title={t("common.collect.fees")}>
      <>
        <Box sx={{ padding: "16px 16px", borderRadius: "12px", background: theme.palette.background.level3 }}>
          <Flex fullWidth justify="space-between">
            <Flex gap="0 8px">
              <TokenImage logo={token0?.logo} tokenId={token0?.address} />
              <Typography color="text.primary">{token0?.symbol}</Typography>
            </Flex>

            <Typography align="right" color="text.primary">
              {feeAmount0 && token0
                ? toSignificantWithGroupSeparator(parseTokenAmount(feeAmount0, token0.decimals).toString())
                : "--"}
            </Typography>
          </Flex>

          <Flex fullWidth sx={{ margin: "16px 0 0 0" }} justify="space-between">
            <Flex gap="0 8px">
              <TokenImage logo={token1?.logo} tokenId={token1?.address} />
              <Typography color="text.primary">{token1?.symbol}</Typography>
            </Flex>

            <Typography align="right" color="text.primary">
              {feeAmount1 && token1
                ? toSignificantWithGroupSeparator(parseTokenAmount(feeAmount1, token1.decimals).toString())
                : "--"}
            </Typography>
          </Flex>
        </Box>

        <Typography mt={1} lineHeight="18px">
          {t("swap.collect.description")}
        </Typography>

        <AuthButton
          variant="contained"
          size="large"
          fullWidth
          sx={{ marginTop: "24px" }}
          onClick={handleCollect}
          disabled={loading || disabled}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {t("common.collect")}
        </AuthButton>
      </>
    </Modal>
  );
}
