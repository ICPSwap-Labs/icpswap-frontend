import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { gridSpacing } from "constants/theme";
import { useStakingGlobalData } from "hooks/staking-token/index";
import GlobalBg1 from "assets/images/staking/1.png";
import GlobalBg2 from "assets/images/staking/2.png";
import GlobalBg3 from "assets/images/staking/3.png";
import { Trans } from "@lingui/macro";
import { useICPPrice } from "store/global/hooks";
import { formatDollarAmount } from "@icpswap/utils";

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
    "&.transactions": {
      background: `url(${GlobalBg2}) no-repeat center / cover`,
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
  const ICPPrice = useICPPrice();
  const classes = useStyle();
  const [globalData, updateGlobalData] = useStakingGlobalData();

  useEffect(() => {
    let timer: number | undefined = window.setInterval(() => {
      updateGlobalData();
    }, 5000);

    return () => {
      if (timer !== null) clearInterval(timer);
      timer = undefined;
    };
  }, []);

  return (
    <Box>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={6}>
          <Grid container className={`tvl ${classes.item}`} direction="column" justifyContent="center">
            <Grid item className={classes.itemTitle}>
              <Grid container>
                <Typography color="text.primary" fontSize="14px">
                  <Trans>TVL</Trans>
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography color="text.primary" fontSize="24px">
                {formatDollarAmount(new BigNumber(globalData?.stakingAmount ?? 0).times(ICPPrice ?? 0).toNumber())}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container className={`${classes.item} reward`} direction="column" justifyContent="center">
            <Grid item className={classes.itemTitle}>
              <Grid container>
                <Typography color="text.primary" fontSize="14px" sx={{ display: "inline-block" }}>
                  <Trans>Total Earned Value</Trans>
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography color="text.primary" fontSize="24px">
                {formatDollarAmount(new BigNumber(globalData?.rewardAmount ?? 0).times(ICPPrice ?? 0).toNumber())}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
