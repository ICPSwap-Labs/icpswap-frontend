import { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { gridSpacing } from "constants/theme";
import { useGetGlobalData } from "hooks/staking-farm";
import GlobalBg1 from "assets/images/staking/1.png";
import GlobalBg3 from "assets/images/staking/3.png";
import { Trans } from "@lingui/macro";

const useStyle = makeStyles(() => ({
  item: {
    height: "145px",
    background: "rgba(80, 95, 186, 0.34)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "12px",
    padding: "29px 25px",
    "&.tvl": {
      background: `url(${GlobalBg1}) no-repeat center / cover`,
    },
    "&.reward": {
      background: `url(${GlobalBg3}) no-repeat center / cover`,
    },
  },
  itemTitle: {
    paddingBottom: "18px",
  },
}));

export default function GlobalData() {
  const classes = useStyle();
  const [result, update] = useGetGlobalData();

  useEffect(() => {
    setTimeout(() => {
      update();
    }, 5000);
  }, [result]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <Grid container className={`${classes.item} tvl`} direction="column" justifyContent="center">
          <Grid item className={classes.itemTitle}>
            <Typography color="text.primary" fontSize="14px">
              <Trans>TVL</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="text.primary" fontSize="24px">
              {result?.stakeTokenTVL ?? "-"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container className={`${classes.item} reward`} direction="column" justifyContent="center">
          <Grid item className={classes.itemTitle}>
            <Grid container>
              <Typography color="text.primary" fontSize="14px" sx={{ display: "inline-block" }}>
                <Trans>Total Farming Rewards</Trans>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography color="text.primary" fontSize="24px">
              {result?.rewardTokenTVL ?? "-"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
