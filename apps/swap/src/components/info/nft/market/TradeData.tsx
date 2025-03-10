import React from "react";
import { Grid, Box, Typography } from "components/Mui";
import { MainCard } from "@icpswap/ui";
import { parseTokenAmount, formatAmount } from "@icpswap/utils";
import { WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";
import { useNFTTradeData } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";

export function DataItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Grid container alignItems="center" justifyContent="center" flexDirection="column">
      <Typography>{label}</Typography>
      <Typography
        color="text.primary"
        fontWeight="500"
        fontSize="26px"
        sx={{
          marginTop: "20px",
        }}
      >
        {value}
      </Typography>
    </Grid>
  );
}

export function TradeData() {
  const { t } = useTranslation();
  const { result } = useNFTTradeData();

  return (
    <Box>
      <MainCard>
        <Grid container>
          <Grid item xs={12} md={6} lg={3}>
            <DataItem
              label={t`Total Volume(WICP)`}
              value={formatAmount(
                parseTokenAmount(result?.totalTurnover ?? 0, WRAPPED_ICP_TOKEN_INFO.decimals).toNumber(),
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DataItem label={t("common.transactions")} value={formatAmount(Number(result?.totalVolume ?? 0))} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DataItem label={t`Listings`} value={formatAmount(Number(result?.listSize ?? 0))} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DataItem
              label={t("common.average.price")}
              value={formatAmount(parseTokenAmount(result?.avgPrice ?? 0, WRAPPED_ICP_TOKEN_INFO.decimals).toNumber())}
            />
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
