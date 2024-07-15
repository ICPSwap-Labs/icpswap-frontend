import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { t } from "@lingui/macro";
import { WRAPPED_ICP } from "@icpswap/tokens";
import { parseTokenAmount, formatAmount, formatDollarAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useSwapPools, useSwapProtocolData, useNFTTradeData } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useSwapGlobalData } from "hooks/info/index";
import { Flex } from "@icpswap/ui";

import { Card, Item, Row, Title } from "./component";
import { Staking } from "./Staking";
import { Farm } from "./Farm";
import ICPPriceChart from "./ICPPriceChart";

const useStyles = makeStyles((theme: Theme) => ({
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
    display: "flex",
    gap: "10px 10px",
    "& .item": {
      flex: "50%",
    },
    "@media(max-width: 960px)": {
      flexDirection: "column",
      "& .item": {
        flex: "100%",
      },
    },
  },
}));

export default function Overview() {
  const classes = useStyles();

  const { result: marketplaceTrade } = useNFTTradeData();
  const { result: swapGlobalData } = useSwapGlobalData();
  const { result: allSwapPools } = useSwapPools();
  const { result: swapProtocol } = useSwapProtocolData();

  return (
    <Box className={classes.box}>
      <Box className={classes.containers}>
        <Flex vertical gap="10px 0" fullWidth align="flex-start" className="item">
          <Card>
            <Title isICP title="ICPSwap" link="https://dashboard.internetcomputer.org" />

            <ICPPriceChart />
          </Card>

          <Card>
            <Title title="Marketplace" to="/marketplace" />

            <Row>
              <Item
                label={t`Total Volume(ICP)`}
                value={formatAmount(
                  parseTokenAmount(marketplaceTrade?.totalTurnover ?? 0, WRAPPED_ICP.decimals).toNumber(),
                )}
              />
            </Row>

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
          </Card>
        </Flex>

        <Flex gap="10px 0" vertical fullWidth className="item">
          <Card>
            <Title title="Swap" to="/swap" />

            <Row>
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
            </Row>

            <Box sx={{ display: "flex" }}>
              <Item label={t`Total Trading Pairs`} value={allSwapPools ? formatAmount(allSwapPools.length) : "--"} />
              <Item
                label={t`Total Users`}
                value={swapGlobalData?.totalUser === undefined ? "--" : formatAmount(Number(swapGlobalData.totalUser))}
              />
            </Box>
          </Card>

          <Staking />

          <Farm />
        </Flex>
      </Box>
    </Box>
  );
}
