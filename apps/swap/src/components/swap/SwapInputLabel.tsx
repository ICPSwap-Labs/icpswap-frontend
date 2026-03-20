import type { Token } from "@icpswap/swap-sdk";
import { Grid, Typography } from "components/Mui";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";

export interface SwapInputLabelProps {
  type: "from" | "to";
  currency: Token | undefined;
  refreshBalance?: boolean;
}

export default function SwapInputLabel({ type, currency, refreshBalance }: SwapInputLabelProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();

  const { result: balance } = useCurrencyBalance(principal, currency ?? undefined, refreshBalance);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Typography color="textPrimary">{type === "from" ? t("common.from") : t("common.to")} </Typography>
      </Grid>
      <Grid item xs={10}>
        <Typography align="right">
          Balance: {!!balance && !!currency ? formatCurrencyAmount(balance, currency?.decimals) : "--"}
        </Typography>
      </Grid>
    </Grid>
  );
}
