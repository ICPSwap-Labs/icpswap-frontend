import { Grid, Typography } from "@mui/material";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";
import { Trans } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";

export interface SwapInputLabelProps {
  type: "from" | "to";
  currency: Token | undefined;
  refreshBalance?: boolean;
}

export default function SwapInputLabel({ type, currency, refreshBalance }: SwapInputLabelProps) {
  const principal = useAccountPrincipal();

  const { result: balance } = useCurrencyBalance(principal, currency ?? undefined, refreshBalance);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Typography color="textPrimary">{type === "from" ? <Trans>From</Trans> : <Trans>To</Trans>} </Typography>
      </Grid>
      <Grid item xs={10}>
        <Typography align="right">
          Balance: {!!balance && !!currency ? formatCurrencyAmount(balance, currency?.decimals) : "--"}
        </Typography>
      </Grid>
    </Grid>
  );
}
