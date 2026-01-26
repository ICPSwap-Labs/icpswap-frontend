import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Button } from "components/Mui";
import { useParsedQueryString } from "@icpswap/hooks";
import { Flex, Wrapper } from "components/index";
import { InfoPools, Positions } from "components/liquidity/index";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import { useTranslation } from "react-i18next";
import i18n from "i18n/index";
import { UnderLineTabList, type UnderLineTab } from "components/TabPanel";

enum TabName {
  TopPools = "TopPools",
  Positions = "Positions",
}

const tabs = [
  { label: i18n.t("liquidity.your.positions"), value: TabName.Positions },
  { label: i18n.t("swap.top.pools"), value: TabName.TopPools },
];

function Liquidity() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadedTabs, setLoadedTabs] = useState<Array<TabName>>([]);
  const { tab: activeTabName } = useParsedQueryString() as { tab: TabName | undefined };

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: undefined, token1: undefined });

  const handleTabChange = useCallback(
    (tab: UnderLineTab) => {
      if (tab.value === activeTabName) return;
      navigate(`/liquidity?tab=${tab.value}`);
    },
    [navigate, activeTabName, location],
  );

  const activeTab = useMemo(() => {
    return activeTabName ?? TabName.Positions;
  }, [activeTabName]);

  useEffect(() => {
    if (!loadedTabs.includes(activeTab)) {
      setLoadedTabs([...loadedTabs, activeTab]);
    }
  }, [activeTab, loadedTabs]);

  return (
    <Wrapper>
      <>
        <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>
          {t("swap.liquidity.pools.title")}
        </Typography>
        <Typography sx={{ fontSize: "16px", margin: "16px 0 0 0", lineHeight: "24px" }}>
          {t("swap.liquidity.description")}
        </Typography>

        <Flex
          fullWidth
          sx={{
            margin: "56px 0 0 0",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "30px 0",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
          justify="space-between"
        >
          <UnderLineTabList tabs={tabs} onChange={handleTabChange} activeTabValue={activeTab} />

          <Button variant="contained" onClick={loadAddLiquidity}>
            {t("swap.add.liquidity")}
          </Button>
        </Flex>

        <Box sx={{ margin: "35px 0 0 0" }}>
          <Box sx={{ display: activeTab === TabName.Positions ? "block" : "none" }}>
            {loadedTabs.includes(TabName.Positions) ? <Positions /> : null}
          </Box>

          <Box sx={{ display: activeTab === TabName.TopPools ? "block" : "none" }}>
            {loadedTabs.includes(TabName.TopPools) ? <InfoPools /> : null}
          </Box>
        </Box>
      </>
    </Wrapper>
  );
}

export default memo(Liquidity);
