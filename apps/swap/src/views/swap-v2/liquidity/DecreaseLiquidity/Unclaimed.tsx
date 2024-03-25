import { useMemo } from "react";
import { Typography, Grid, Box, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { usePositionFees } from "hooks/swap/v2/usePositionFees";
import { numberToString, toSignificant } from "@icpswap/utils";
import { CurrencyAmount, Position } from "@icpswap/swap-sdk";
import { Theme } from "@mui/material/styles";
import BigNumber from "bignumber.js";

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.level2,
    borderRadius: `12px`,
    border: `1px solid ${theme.palette.background.level3}`,
    padding: "16px 12px",
  },
}));

export interface UnclaimedProps {
  positionId: number | bigint | string | undefined;
  invalid?: boolean;
  position: Position | undefined;
}

export default function Unclaimed({ position, positionId, invalid = false }: UnclaimedProps) {
  const classes = useStyle();

  const { token0, token1 } = position?.pool || {};
  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(positionId, invalid);

  const currencyFeeAmount0 = useMemo(() => {
    if (!token0 || !feeAmount0) return undefined;
    return CurrencyAmount.fromRawAmount(token0, numberToString(feeAmount0));
  }, [feeAmount0, token0]);

  const currencyFeeAmount1 = useMemo(() => {
    if (!token1 || !feeAmount1) return undefined;
    return CurrencyAmount.fromRawAmount(token1, numberToString(feeAmount1));
  }, [feeAmount1, token1]);

  return (
    <Box>
      <Typography color="text.primary">Unclaimed fees</Typography>
      <Box mt="12px" className={classes.wrapper}>
        <Grid container alignItems="center">
          <Avatar sx={{ width: "32px", height: "32px", marginRight: "12px", bgcolor: "#273155" }} src={token0?.logo}>
            &nbsp;
          </Avatar>
          <Typography color="text.primary">{token0?.symbol}</Typography>
          <Grid item xs>
            <Typography align="right" color="text.primary">
              {currencyFeeAmount0
                ? toSignificant(new BigNumber(currencyFeeAmount0.toExact()).multipliedBy(0.8).toString(), 6)
                : 0}
            </Typography>
          </Grid>
        </Grid>
        <Grid mt="10px" container alignItems="center">
          <Avatar sx={{ width: "32px", height: "32px", marginRight: "12px", bgcolor: "#273155" }} src={token1?.logo}>
            &nbsp;
          </Avatar>
          <Typography color="text.primary">{token1?.symbol}</Typography>
          <Grid item xs>
            <Typography align="right" color="text.primary">
              {currencyFeeAmount1
                ? toSignificant(new BigNumber(currencyFeeAmount1.toExact()).multipliedBy(0.8).toString(), 6)
                : 0}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
