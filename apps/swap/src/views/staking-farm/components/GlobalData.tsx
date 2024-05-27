import { Grid, Typography, Box } from "components/Mui";
import { makeStyles } from "@mui/styles";
import { useFarmGlobalTVL } from "hooks/staking-farm";
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
  const globalTVL = useFarmGlobalTVL();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: "0 24px",
        "@media(max-width: 960px)": {
          flexDirection: "column",
          gap: "24px 0",
        },
      }}
    >
      <Box
        sx={{
          flex: "50%",
          "@media(max-width: 960px)": {
            flex: "100%",
          },
        }}
      >
        <Box className={`${classes.item} tvl`}>
          <Typography color="text.primary" fontSize="14px" sx={{ margin: "0 0 18px 0" }}>
            <Trans>TVL</Trans>
          </Typography>

          <Grid item>
            <Typography color="text.primary" fontSize="24px">
              {globalTVL?.stakeTokenTVL ?? "-"}
            </Typography>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          flex: "50%",
          "@media(max-width: 960px)": {
            flex: "100%",
          },
        }}
      >
        <Box className={`${classes.item} reward`}>
          <Typography color="text.primary" fontSize="14px" sx={{ margin: "0 0 18px 0" }}>
            <Trans>Total Farming Rewards</Trans>
          </Typography>

          <Typography color="text.primary" fontSize="24px">
            {globalTVL?.rewardTokenTVL ?? "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
