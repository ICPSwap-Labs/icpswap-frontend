import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
// import MarketDataBg from "assets/images/nft/market_data.png";

const useStyles = makeStyles(() => {
  return {
    container: {
      overflow: "hidden",
      // background: "linear-gradient(94.73deg, rgba(52, 56, 95, 0.04) 0%, rgba(75, 98, 188, 0.0008) 100.99%)",
      backdropFilter: "blur(116px)",
      borderRadius: "12px",
      // background: `url(${MarketDataBg})`,
      // backgroundSize: "cover",
      padding: "35px 0",
    },
  };
});

export default function MarketData() {
  const classes = useStyles();

  return (
    <Grid className={classes.container} container>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>
            <Trans>Projects</Trans>
          </Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>
            <Trans>NFT Counts</Trans>
          </Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>
            <Trans>Amount Traded</Trans>
          </Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>
            <Trans>Volume Traded</Trans>
          </Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
