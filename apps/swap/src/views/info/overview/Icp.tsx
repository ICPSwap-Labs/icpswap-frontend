import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { ICP } from "@icpswap/tokens";
import { parseTokenAmount, formatDollarAmount, BigNumber, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Flex, MainCard, TokenImage, Proportion } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { useICPBlocksManager } from "hooks/useICBlocks";
import { useInfoToken } from "hooks/uesInfoToken";
import { useTokenSupply } from "hooks/token/calls";
import { useICPPriceList } from "store/global/hooks";
import { useTokenAnalysis } from "@icpswap/hooks";

export function Icp() {
  const theme = useTheme();

  const { result: icpTokenInfo } = useInfoToken(ICP.address);
  const { result: icpTotalSupply } = useTokenSupply(ICP.address);
  const { result: tokenAnalysis } = useTokenAnalysis(ICP.address);

  const ICPPriceList = useICPPriceList();

  const icpToCycles = ICPPriceList && ICPPriceList.length && ICPPriceList[ICPPriceList.length - 1].xdr;

  const { blocks, secondBlocks } = useICPBlocksManager();

  const fdv = useMemo(() => {
    if (isNullArgs(icpTotalSupply) || isNullArgs(icpTokenInfo)) return null;

    return formatDollarAmount(
      parseTokenAmount(icpTotalSupply, ICP.decimals).multipliedBy(icpTokenInfo.priceUSD).toString(),
    );
  }, [icpTotalSupply, icpTokenInfo]);

  const marketCap = useMemo(() => {
    if (isNullArgs(tokenAnalysis) || isNullArgs(icpTokenInfo)) return null;

    return formatDollarAmount(new BigNumber(tokenAnalysis.marketAmount).multipliedBy(icpTokenInfo.priceUSD).toString());
  }, [tokenAnalysis, icpTokenInfo]);

  return (
    <MainCard
      level={3}
      sx={{
        padding: "32px",
        "@media(max-width: 640px)": {
          padding: "16px",
        },
      }}
    >
      <Flex
        gap="0 8px"
        sx={{
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: " 16px 0",
            alignItems: "flex-start",
          },
        }}
      >
        <Flex gap="0 8px">
          <TokenImage logo={ICP.logo} size="24px" />

          <Flex gap="0 4px">
            <Typography color="text.primary" fontWeight={500} fontSize="18px">
              ICP
            </Typography>
            <Typography fontSize="12px">(Internet Computer)</Typography>
          </Flex>
        </Flex>

        <Box sx={{ padding: "4px 12px", borderRadius: "30px", background: theme.palette.background.level4 }}>
          <Typography>1 ICP = {icpToCycles || "--"} T Cycles</Typography>
        </Box>
      </Flex>

      <Box sx={{ margin: "30px 0 0 0" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            "@media(max-width: 640px)": {
              gridTemplateColumns: "1fr",
              gap: "24px 0",
            },
          }}
        >
          <Box>
            <Typography>
              <Trans>Price</Trans>
            </Typography>
            <Flex gap="0 4px" align="flex-end">
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {icpTokenInfo ? formatDollarAmount(icpTokenInfo.priceUSD) : "--"}
              </Typography>

              <Proportion value={icpTokenInfo?.priceUSDChange} fontSize="16px" />
            </Flex>
          </Box>

          <Box>
            <Typography>
              <Trans>Market Cap</Trans>
            </Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {nonNullArgs(marketCap) ? marketCap : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography>
              <Trans>Fully Diluted Market Cap</Trans>
            </Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {nonNullArgs(fdv) ? fdv : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography>
              <Trans>Blocks</Trans>
            </Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {blocks ? new BigNumber(blocks).toFormat() : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography>
              <Trans>Blocks/second</Trans>
            </Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {secondBlocks ? new BigNumber(secondBlocks).toFixed(2) : "--"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
}
