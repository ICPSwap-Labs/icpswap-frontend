import { Box, Grid, Typography, CircularProgress, makeStyles, Theme } from "components/Mui";
import SwapModal from "components/modal/swap";
import { Trans, t } from "@lingui/macro";
import { toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Token, CurrencyAmount, Pool } from "@icpswap/swap-sdk";
import Button from "components/authentication/ButtonConnector";
import { TokenImage } from "components/index";
import { useMemo, useState } from "react";
import { useCollectFeeCallback } from "hooks/swap/useClaimFees";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import StepViewButton from "components/Steps/View";

const useStyles = makeStyles((theme: Theme) => ({
  feeBox: {
    padding: "16px 16px",
    borderRadius: "12px",
    background: theme.palette.background.level3,
  },
}));

export interface CollectFeeModalProps {
  open: boolean;
  onClose: () => void;
  currencyFeeAmount0: CurrencyAmount<Token> | undefined;
  currencyFeeAmount1: CurrencyAmount<Token> | undefined;
  pool: Pool | undefined | null;
  positionId: number | bigint | undefined | string;
  onClaimedSuccessfully?: () => void;
}

export function CollectFeesModal({
  open,
  onClose,
  currencyFeeAmount0,
  currencyFeeAmount1,
  pool,
  positionId,
  onClaimedSuccessfully,
}: CollectFeeModalProps) {
  const classes = useStyles();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [loading, setLoading] = useState(false);

  const { token0, token1 } = useMemo(() => {
    if (!pool) return { token0: undefined, token1: undefined };
    return { token0: pool.token0, token1: pool.token1 };
  }, [pool]);

  const getClaimFeeCall = useCollectFeeCallback();

  const handleCollect = async () => {
    if (loading || !positionId || !pool || !currencyFeeAmount0 || !currencyFeeAmount1) return;

    setLoading(true);
    onClose();

    const { call, key } = getClaimFeeCall({
      pool,
      positionId: BigInt(positionId),
      currencyFeeAmount0,
      currencyFeeAmount1,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} poolId={poolId} tokenId={tokenId} />);
      },
    });

    const loadingTipKey = openLoadingTip(
      `Collect ${currencyFeeAmount0.toSignificant(6, {
        groupSeparator: ",",
      })} ${token0?.symbol} and ${currencyFeeAmount1.toSignificant(6, { groupSeparator: "," })} ${token1?.symbol}`,
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    const result = await call();

    if (result === true) {
      openSuccessTip(t`Collected successfully`);
      if (onClaimedSuccessfully) onClaimedSuccessfully();
    }

    closeLoadingTip(loadingTipKey);
    setLoading(false);
  };

  const disabled = useMemo(() => {
    if (!currencyFeeAmount0 || !currencyFeeAmount1) return true;
    return currencyFeeAmount0.equalTo(0) && currencyFeeAmount1.equalTo(0);
  }, [currencyFeeAmount0, currencyFeeAmount1]);

  return (
    <SwapModal open={open} onClose={onClose} title={t`Collect Fees`}>
      <>
        <Box className={classes.feeBox}>
          <Grid container alignItems="center">
            <Grid item xs container alignItems="center">
              <Grid item mr={1}>
                <TokenImage logo={token0?.logo} tokenId={token0?.address} />
              </Grid>
              <Grid item>
                <Typography color="text.primary">{token0?.symbol}</Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography align="right" color="text.primary">
                {currencyFeeAmount0 ? toSignificantWithGroupSeparator(currencyFeeAmount0.toExact()) : "--"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container mt={2} alignItems="center">
            <Grid item xs container alignItems="center">
              <Grid item mr={1}>
                <TokenImage logo={token1?.logo} tokenId={token1?.address} />
              </Grid>
              <Grid item>
                <Typography color="text.primary">{token1?.symbol}</Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography align="right" color="text.primary">
                {currencyFeeAmount1 ? toSignificantWithGroupSeparator(currencyFeeAmount1.toExact()) : "--"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography mt={1} lineHeight="18px">
          <Trans>You can collect the liquidity incentive reward from the transaction according to your position.</Trans>
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ marginTop: "24px" }}
          onClick={handleCollect}
          disabled={loading || disabled}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          <Trans>Collect</Trans>
        </Button>
      </>
    </SwapModal>
  );
}
