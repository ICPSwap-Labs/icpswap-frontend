import { useMemo } from "react";
import { Typography, Grid, Box, makeStyles, Theme } from "components/Mui";
import { CurrencyAmount, Position } from "@icpswap/swap-sdk";
import { toSignificant, numberToString, BigNumber } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.level2,
    borderRadius: `12px`,
    border: `1px solid ${theme.palette.background.level3}`,
    padding: "16px 12px",
  },
}));

export interface UnclaimedProps {
  position: Position | undefined;
  feeAmount0: bigint | undefined;
  feeAmount1: bigint | undefined;
}

export default function Unclaimed({ position, feeAmount0, feeAmount1 }: UnclaimedProps) {
  const { t } = useTranslation();
  const classes = useStyle();

  const { token0, token1 } = position?.pool || {};

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
      <Typography color="text.primary">{t("common.uncollected.fees")}</Typography>
      <Box mt="12px" className={classes.wrapper}>
        <Grid container alignItems="center">
          <Box sx={{ width: "32px", height: "32px", marginRight: "12px" }}>
            <TokenImage size="32px" logo={token0?.logo} tokenId={token0?.address} />
          </Box>
          <Typography color="text.primary">{token0?.symbol}</Typography>
          <Grid item xs>
            <Typography align="right" color="text.primary">
              {currencyFeeAmount0 ? toSignificant(new BigNumber(currencyFeeAmount0.toExact()).toString(), 6) : 0}
            </Typography>
          </Grid>
        </Grid>
        <Grid mt="10px" container alignItems="center">
          <Box sx={{ width: "32px", height: "32px", marginRight: "12px" }}>
            <TokenImage size="32px" logo={token1?.logo} tokenId={token1?.address} />
          </Box>
          <Typography color="text.primary">{token1?.symbol}</Typography>
          <Grid item xs>
            <Typography align="right" color="text.primary">
              {currencyFeeAmount1 ? toSignificant(new BigNumber(currencyFeeAmount1.toExact()).toString(), 6) : 0}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
