import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard } from "components/index";

export default function LiquidityPoolIntro() {
  return (
    <MainCard level={1} sx={{ height: "244px" }} className="lightGray200">
      <Typography variant="h3" align="center" color="text.primary">
        <Trans>Liquidity Pool</Trans>
      </Typography>
      <Box mt={2}>
        <Typography fontSize={16} align="center">
          <Trans>
            80% of the trading fees are rewarded to the liquidity providers, and the remaining 20% of the trading fees
            are put into the ICS Repurchase-and-Burn Pool.
          </Trans>
        </Typography>
      </Box>
    </MainCard>
  );
}
