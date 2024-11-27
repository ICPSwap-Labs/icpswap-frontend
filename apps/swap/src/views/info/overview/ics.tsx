import { Box, Typography, makeStyles, useTheme } from "components/Mui";
import { t, Trans } from "@lingui/macro";
import { ICS, WRAPPED_ICP } from "@icpswap/tokens";
import { parseTokenAmount, formatAmount, formatDollarAmount, BigNumber } from "@icpswap/utils";
import { useSwapPools, useSwapProtocolData, useNFTTradeData, useTokensFromList, useInfoToken } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useSwapGlobalData } from "hooks/info/index";
import { Flex, MainCard, Proportion } from "@icpswap/ui";
import { TokenImage } from "components/index";

import { Card, Item, Row, Title } from "./component";
import ICPPriceChart from "./ICPPriceChart";
import { Icp } from "./Icp";
import { ICPSwap } from "./icpswap";
import { ICSPriceChart } from "./icsPriceChart";

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    minHeight: "calc(100vh - 160px)",
    padding: "20px",
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

export function Ics() {
  const theme = useTheme();

  const icsTokenInfo = useInfoToken(ICS.address);

  return (
    <Box sx={{ display: "grid", width: "100%", gridTemplateColumns: "1fr 320px" }}>
      <Flex
        sx={{
          background: theme.palette.background.level3,
          padding: "32px",
          borderTopLeftRadius: "24px",
          borderBottomLeftRadius: "24px",
        }}
        vertical
        align="flex-start"
      >
        <Flex justify="space-between" fullWidth>
          <Flex gap="0 12px">
            <TokenImage size="36px" logo={ICS.logo} tokenId={ICS.address} />

            <Flex align="flex-end" gap="0 8px">
              <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "24px" }}>ICS</Typography>
              <Typography sx={{ fontSize: "16px" }}>ICPSwap Token</Typography>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify="space-between" fullWidth sx={{ margin: "16px 0 0 0" }}>
          <Flex gap="0 8px" align="flex-end">
            <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>
              {icsTokenInfo ? formatDollarAmount(icsTokenInfo.priceUSD) : "--"}
            </Typography>

            <Proportion value={icsTokenInfo?.priceUSD} />
          </Flex>
        </Flex>

        <Box sx={{ margin: "32px 0 0 0", width: "100%" }}>
          <ICSPriceChart />
        </Box>
      </Flex>

      <Flex
        vertical
        align="stretch"
        sx={{
          height: "100%",
          background: theme.palette.background.level4,
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
          gap: "40px 0",
          padding: "32px",
        }}
      >
        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500}>
            $10.9M
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500}>
            $10.9M
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500}>
            $10.9M
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500}>
            $10.9M
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}
