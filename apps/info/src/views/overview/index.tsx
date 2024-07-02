import { ReactNode } from "react";
import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { t } from "@lingui/macro";
import { WRAPPED_ICP } from "@icpswap/tokens";
import { parseTokenAmount, formatAmount, formatDollarAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useSwapPools, useSwapProtocolData, useNFTTradeData, useStakeIntervalGlobalData } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { mockALinkAndOpen } from "utils/index";
import { useStakingTokenAllPools } from "hooks/staking-token/index";
import { useAllFarmPools, useFarmGlobalTVL } from "hooks/staking-farm/index";
import { useICPPrice } from "store/global/hooks";
import { useSwapGlobalData } from "hooks/info/index";

import ICPPriceChart from "./ICPPriceChart";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "32px 32px",
    [theme.breakpoints.down("sm")]: {
      padding: "16px 15px",
    },
    "&.footer": {
      padding: "16px 24px",
      [theme.breakpoints.down("sm")]: {
        padding: "16px 24px",
      },
    },
  },
  box: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    minHeight: "calc(100vh - 160px)",
    padding: "20px",
    background: "radial-gradient(40% 30% at 50% 4%, #FF8FE033 0,rgba(255,255,255,0) 100%)",
    [theme.breakpoints.down("sm")]: {
      padding: "10px",
    },
  },
  containers: {
    width: "100%",
    height: "100%",
    maxWidth: "1400px",
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gridGap: "10px 10px",
    "@media screen and (min-width:960px)": {
      gridTemplateColumns: "1fr 1fr",
      gridGap: "10px 10px",
    },
  },
  title: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#FFFFFF",
  },
  itemMargin: {
    margin: "0 0 25px 0",
  },
}));

export function Item({ label, value }: { label: ReactNode; value: number | string | BigNumber | bigint | undefined }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography>{label}</Typography>
      <Typography color="text.primary" sx={{ fontSize: "20px", fontWeight: 500, margin: "10px 0 0 0" }}>
        {value}
      </Typography>
    </Box>
  );
}

function LinkArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="10" fill="white" fillOpacity="0.17" />
      <path
        opacity="0.6"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5858 12C11.5858 11.4477 12.0335 11 12.5858 11H19.5858C20.1381 11 20.5858 11.4477 20.5858 12V19C20.5858 19.5523 20.1381 20 19.5858 20C19.0335 20 18.5858 19.5523 18.5858 19L18.5858 14.6064L12.7071 20.4851C12.3166 20.8757 11.6834 20.8757 11.2929 20.4851C10.9024 20.0946 10.9024 19.4614 11.2929 19.0709L17.3638 13H12.5858C12.0335 13 11.5858 12.5523 11.5858 12Z"
        fill="white"
      />
    </svg>
  );
}

interface LinkArrowProps {
  link?: string;
  to?: string;
}

function LinkArrow({ link, to }: LinkArrowProps) {
  const history = useHistory();

  const handleClick = () => {
    if (to) {
      history.push(to);
      return;
    }

    if (link) {
      mockALinkAndOpen(link, "overview-link");
    }
  };

  return (
    <Box sx={{ cursor: "pointer" }} onClick={handleClick}>
      <LinkArrowIcon />
    </Box>
  );
}

interface TitleProps {
  title: string;
  link?: string;
  to?: string;
  isICP?: boolean;
}

function Title({ title, link, to, isICP }: TitleProps) {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", margin: isICP ? "0 0 10px 0" : "0 0 35px 0" }}>
      <Typography className={classes.title} gutterBottom component="div">
        {title}
      </Typography>
      <LinkArrow link={link} to={to} />
    </Box>
  );
}

export default function Overview() {
  const classes = useStyles();

  const icpPrice = useICPPrice();

  const { result: marketplaceTrade } = useNFTTradeData();

  const { data: stakingGlobalData } = useStakeIntervalGlobalData();
  const { result: stakingTokenAllPools } = useStakingTokenAllPools();

  const farmGlobalTvl = useFarmGlobalTVL();
  const { result: farmAllPools } = useAllFarmPools();

  const { result: swapGlobalData } = useSwapGlobalData();
  const { result: allSwapPools } = useSwapPools();
  const { result: swapProtocol } = useSwapProtocolData();

  return (
    <Box className={classes.box}>
      <Box className={classes.containers}>
        <Box className={classes.card}>
          <Title isICP title="ICPSwap" link="https://dashboard.internetcomputer.org" />

          <ICPPriceChart />
        </Box>

        <Box sx={{ display: "grid", gap: "10px 0", gridTemplateColumns: "1fr" }}>
          <Box className={classes.card}>
            <Title title="Swap" to="/swap" />

            <Box className={classes.itemMargin} sx={{ display: "flex" }}>
              <Item
                label={t`TVL`}
                value={swapProtocol?.tvlUSD === undefined ? "--" : formatDollarAmount(swapProtocol.tvlUSD)}
              />
              <Item
                label={t`Total Volume`}
                value={
                  swapGlobalData?.totalVolume === undefined ? "--" : formatDollarAmount(swapGlobalData.totalVolume)
                }
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <Item label={t`Total Trading Pairs`} value={allSwapPools ? formatAmount(allSwapPools.length) : "--"} />
              <Item
                label={t`Total Users`}
                value={swapGlobalData?.totalUser === undefined ? "--" : formatAmount(Number(swapGlobalData.totalUser))}
              />
            </Box>
          </Box>

          <Box className={classes.card}>
            <Title title="Staking Pool" to="/stake" />

            <Box className={classes.itemMargin}>
              <Item
                label={t`TVL`}
                value={formatDollarAmount(
                  new BigNumber(stakingGlobalData?.valueOfStaking ?? 0).times(icpPrice ?? 0).toString(),
                )}
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <Item
                label={t`Total Earned Value`}
                value={formatDollarAmount(
                  new BigNumber(stakingGlobalData?.valueOfRewardsInProgress ?? 0).times(icpPrice ?? 0).toString(),
                )}
              />
              <Item label={t`Total Pools`} value={stakingTokenAllPools ? stakingTokenAllPools.length : "--"} />
            </Box>
          </Box>
        </Box>

        <Box className={classes.card}>
          <Title title="Marketplace" to="/marketplace" />

          <Box className={classes.itemMargin}>
            <Item
              label={t`Total Volume(ICP)`}
              value={formatAmount(
                parseTokenAmount(marketplaceTrade?.totalTurnover ?? 0, WRAPPED_ICP.decimals).toNumber(),
              )}
            />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Item
              label={t`Transactions`}
              value={formatAmount(new BigNumber(marketplaceTrade?.totalVolume.toString() ?? 0).toNumber())}
            />
            <Item
              label={t`Listings`}
              value={formatAmount(new BigNumber(marketplaceTrade?.listSize.toString() ?? 0).toNumber())}
            />
          </Box>
        </Box>

        <Box className={classes.card}>
          <Title title="Farms" to="/farm" />

          <Box className={classes.itemMargin}>
            <Item label={t`TVL`} value={farmGlobalTvl.stakeTokenTVL} />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Item label={t`Total Earned Value`} value={farmGlobalTvl.rewardTokenTVL} />
            <Item label={t`Total Pools`} value={farmAllPools ? farmAllPools.length : "--"} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
