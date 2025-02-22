import { Grid, Typography, makeStyles } from "components/Mui";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    container: {
      overflow: "hidden",
      backdropFilter: "blur(116px)",
      borderRadius: "12px",
      padding: "35px 0",
    },
  };
});

export default function MarketData() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid className={classes.container} container>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>{t("nft.projects")}</Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>{t("nft.counts")}</Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>{t("nft.amount.traded")}</Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>{t("nft.volume.traded")}</Typography>
          <Typography fontSize="26px" color="text.primary" fontWeight="500" sx={{ marginTop: "20px" }}>
            50000
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
