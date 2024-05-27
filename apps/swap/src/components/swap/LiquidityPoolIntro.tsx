import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { MainCard } from "components/index";

const useStyle = makeStyles(() => {
  return {
    button: {
      width: "230px",
      height: "48px",
    },
  };
});

export default function LiquidityPoolIntro({ version }: { version?: "v2" | "v3" }) {
  const classes = useStyle();
  const history = useHistory();

  const loadAddLiquidity = useCallback(() => {
    if (version === "v2") {
      history.push("/swap/v2/liquidity/add");
    } else {
      history.push("/liquidity/add");
    }
  }, [history]);

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
      <Grid container mt={4} justifyContent="center">
        <Grid item>
          <Button className={classes.button} variant="contained" onClick={loadAddLiquidity}>
            <Trans>Add Liquidity</Trans>
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
}
