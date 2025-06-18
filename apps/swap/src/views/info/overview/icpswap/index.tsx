import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, formatDollarAmount, nonUndefinedOrNull } from "@icpswap/utils";
import { useTokensFromList } from "@icpswap/hooks";
import { Flex, MainCard } from "@icpswap/ui";
import { useMemo, useState } from "react";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

import { Staking } from "./Staking";
import { Farm } from "./Farm";
import { Swap } from "./Swap";
import { IcpswapContext } from "./context";

export function ICPSwap() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [swapTVL, setSwapTVL] = useState<string | number | Null>(null);
  const [farmTVL, setFarmTVL] = useState<string | number | Null>(null);
  const [stakeTVL, setStakeTVL] = useState<string | number | Null>(null);

  const { result: tokenList } = useTokensFromList();

  const tvl = useMemo(() => {
    if (nonUndefinedOrNull(swapTVL) && nonUndefinedOrNull(farmTVL) && nonUndefinedOrNull(stakeTVL)) {
      return new BigNumber(swapTVL).plus(farmTVL).plus(stakeTVL);
    }
  }, [swapTVL, farmTVL, stakeTVL]);

  return (
    <IcpswapContext.Provider value={{ swapTVL, farmTVL, stakeTVL, setFarmTVL, setStakeTVL, setSwapTVL }}>
      <Box sx={{ width: "100%" }}>
        <MainCard level={3}>
          <Typography fontSize="18px" color="text.primary" fontWeight={500}>
            ICPSwap
          </Typography>

          <Box
            sx={{
              background: theme.palette.background.level4,
              borderRadius: "24px",
              padding: "24px 0",
              display: "flex",
              margin: "32px 0 0 0",
              border: "1px solid #38446C",
            }}
          >
            <Flex sx={{ flex: "50%" }} vertical gap="16px 0" align="center">
              <Typography>TVL</Typography>
              <Typography sx={{ fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
                {nonUndefinedOrNull(tvl) ? formatDollarAmount(tvl.toString()) : "--"}
              </Typography>
            </Flex>
            <Flex sx={{ flex: "50%" }} vertical gap="16px 0">
              <Typography>{t("common.token.list")}</Typography>
              <Typography sx={{ fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
                {t("info.overview.tokens", { amount: tokenList ? tokenList.length : "--" })}
              </Typography>
            </Flex>
          </Box>

          <Box
            sx={{
              margin: "24px 0 0 0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              "@media(max-width: 640px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <Swap />
            <Staking />
            <Farm />
          </Box>
        </MainCard>
      </Box>
    </IcpswapContext.Provider>
  );
}
