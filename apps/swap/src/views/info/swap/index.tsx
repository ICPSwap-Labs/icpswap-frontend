import { Typography, Box, useTheme } from "components/Mui";
import { InfoWrapper } from "components/index";
import { useGlobalCharts } from "@icpswap/hooks";
import { GridAutoRows, Flex } from "@icpswap/ui";
import { useGlobalProtocol } from "hooks/info/useSwapChartData";
import { useTranslation } from "react-i18next";
import { TVLChartsWrapper, VolumeChartsWrapper } from "components/info";

import Transactions from "./Transactions";
import TopPools from "./TopPools";
import TopTokens from "./TopTokens";

export default function SwapOverview() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { result: globalProtocol } = useGlobalProtocol();
  const { result: globalCharts } = useGlobalCharts({ level: "d1", page: 1, limit: 1000 });

  return (
    <InfoWrapper>
      <GridAutoRows gap="20px">
        <Flex fullWidth>
          <Typography sx={{ color: theme.colors.dark400 }} fontSize="16px" fontWeight="500">
            {t("info.swap.overview")}
          </Typography>
        </Flex>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 1rem",

            "@media (max-width: 840px)": {
              gridTemplateColumns: "1fr",
              gap: "1rem 0",
            },
          }}
        >
          <TVLChartsWrapper globalCharts={globalCharts} globalProtocol={globalProtocol} />

          <VolumeChartsWrapper globalCharts={globalCharts} globalProtocol={globalProtocol} />
        </Box>

        <TopTokens />

        <TopPools />

        <Transactions />
      </GridAutoRows>
    </InfoWrapper>
  );
}
