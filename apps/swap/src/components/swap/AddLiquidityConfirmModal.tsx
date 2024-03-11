import { useState, useMemo } from "react";
import { Typography, Grid, Button } from "@mui/material";
import SwapModal from "components/modal/swap";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import { Bound } from "constants/swap";
import { Trans } from "@lingui/macro";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Position, Token } from "@icpswap/swap-sdk";
import { useTicksAtLimitInvert } from "hooks/swap/usePriceInvert";

export interface AddLiquidityConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  position: Position;
  baseCurrencyDefault?: Token;
}

export default function AddLiquidityConfirmModal({
  open,
  onCancel,
  onConfirm,
  position,
  baseCurrencyDefault,
}: AddLiquidityConfirmModalProps) {
  const currency0 = position?.pool?.token0;
  const currency1 = position?.pool?.token1;

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const baseCurrency = useMemo(() => {
    const base = baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0;

    if (manuallyInverted) {
      if (base === currency0) return currency1;
      return currency0;
    }

    return base;
  }, [baseCurrencyDefault, currency1, currency0, manuallyInverted]);

  const sorted = baseCurrency === currency0;
  const quoteCurrency = sorted ? currency1 : currency0;

  const ticksAtLimit = useTicksAtLimitInvert({
    position,
    inverted: manuallyInverted,
  });

  const { price, priceLower, priceUpper } = useMemo(() => {
    const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1);

    const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert();
    const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert();

    return {
      price,
      priceLower,
      priceUpper,
    };
  }, [sorted, position]);

  const onConvertClick = () => {
    setManuallyInverted(!manuallyInverted);
  };

  return (
    <SwapModal open={open} onClose={onCancel} title="Add Liquidity">
      <>
        <Grid container flexDirection="column" spacing={3}>
          <Grid item container>
            <Typography>
              <Trans>Deposited Amount</Trans>
            </Typography>
            <Grid item xs container flexDirection="column" justifyContent="flex-end">
              <Typography color="textPrimary" align="right">
                {`${position.amount0.toSignificant(6, { groupSeparator: "," })} ${currency0.symbol}`}
              </Typography>
              <Typography
                color="textPrimary"
                align="right"
                sx={{
                  marginTop: "8px",
                }}
              >
                {`${position.amount1.toSignificant(6, { groupSeparator: "," })} ${currency1.symbol}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Typography>
              <Trans>Current Price</Trans>
            </Typography>
            <Grid item xs container justifyContent="flex-end">
              <Typography color="textPrimary" align="right">
                {`${price.toSignificant(5, { groupSeparator: "," })} ${quoteCurrency.symbol} per ${
                  baseCurrency.symbol
                }`}
              </Typography>
              <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={onConvertClick} />
            </Grid>
          </Grid>
          <Grid item container>
            <Typography>
              <Trans>Price Range</Trans>
            </Typography>
            <Grid item xs container justifyContent="flex-end">
              <Typography color="textPrimary" align="right">
                {`${formatTickPrice(priceLower, ticksAtLimit, Bound.LOWER)}`} -{" "}
                {`${formatTickPrice(priceUpper, ticksAtLimit, Bound.UPPER)}`}{" "}
                {`${quoteCurrency?.symbol} per ${baseCurrency?.symbol}`}
              </Typography>
              <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={onConvertClick} />
            </Grid>
          </Grid>
        </Grid>
        <Button variant="contained" size="large" fullWidth sx={{ marginTop: "40px" }} onClick={onConfirm}>
          <Trans>Add</Trans>
        </Button>
      </>
    </SwapModal>
  );
}
