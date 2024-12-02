import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { ICP, ICS } from "@icpswap/tokens";
import { parseTokenAmount, formatAmount, formatDollarAmount, BigNumber, nonNullArgs } from "@icpswap/utils";
import { useInfoToken, useTokenAnalysis, useTokenSupply } from "@icpswap/hooks";
import { Flex, Proportion } from "@icpswap/ui";
import { TokenImage } from "components/index";

import { ICSPriceChart } from "./icsPriceChart";

export function Ics() {
  const theme = useTheme();

  const infoToken = useInfoToken(ICS.address);
  const icpInfoToken = useInfoToken(ICP.address);
  const { result: tokenSupply } = useTokenSupply(ICS.address);
  const { result: tokenAnalysis } = useTokenAnalysis(ICS.address);

  const marketCap = useMemo(() => {
    if (nonNullArgs(tokenAnalysis) && nonNullArgs(infoToken)) {
      return new BigNumber(tokenAnalysis.marketAmount).multipliedBy(infoToken.priceUSD).toString();
    }
  }, [tokenAnalysis, infoToken]);

  const fdv = useMemo(() => {
    if (nonNullArgs(tokenSupply) && nonNullArgs(infoToken)) {
      return parseTokenAmount(tokenSupply, ICS.decimals).multipliedBy(infoToken.priceUSD).toString();
    }
  }, [tokenSupply, infoToken]);

  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "1fr 320px",
        "@media(max-width: 640px)": {
          gridTemplateColumns: "1fr",
          gap: "20px",
        },
      }}
    >
      <Flex
        sx={{
          background: theme.palette.background.level3,
          padding: "32px",
          borderTopLeftRadius: "24px",
          borderBottomLeftRadius: "24px",
          "@media(max-width: 640px)": {
            borderTopRightRadius: "24px",
            borderBottomRightRadius: "24px",
            padding: "16px",
          },
        }}
        vertical
        align="flex-start"
      >
        <Flex
          justify="space-between"
          fullWidth
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px 0",
            },
          }}
        >
          <Flex gap="0 12px">
            <TokenImage size="36px" logo={ICS.logo} tokenId={ICS.address} />

            <Flex align="flex-end" gap="0 8px">
              <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "24px" }}>ICS</Typography>
              <Typography sx={{ fontSize: "16px" }}>ICPSwap Token</Typography>
            </Flex>
          </Flex>

          {infoToken && icpInfoToken ? (
            <Typography>
              1 ICS = {new BigNumber(infoToken.priceUSD).dividedBy(icpInfoToken.priceUSD).toFormat(5)} ICP
            </Typography>
          ) : null}
        </Flex>

        <Flex justify="space-between" fullWidth sx={{ margin: "16px 0 0 0" }}>
          <Flex gap="0 8px" align="flex-end">
            <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>
              {infoToken ? formatDollarAmount(infoToken.priceUSD) : "--"}
            </Typography>

            <Proportion value={infoToken?.priceUSD} />
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
          "@media(max-width: 640px)": {
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            padding: "16px",
          },
        }}
      >
        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500} color="text.primary">
            {marketCap ? formatDollarAmount(marketCap) : "--"}
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Fully Diluted Market Cap</Typography>
          <Typography fontSize="28px" fontWeight={500} color="text.primary">
            {fdv ? formatDollarAmount(fdv) : "--"}
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Amount Burned</Typography>
          <Typography fontSize="28px" fontWeight={500} color="text.primary">
            $10.9M
          </Typography>
        </Flex>

        <Flex vertical gap="16px 0" align="flex-start">
          <Typography fontSize="16px">Holds</Typography>
          <Typography fontSize="28px" fontWeight={500} color="text.primary">
            {tokenAnalysis ? formatAmount(tokenAnalysis.holders.toString()) : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}
