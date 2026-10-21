import { useParsedQueryString } from "@icpswap/hooks";
import { Flex, Wrapper } from "components/index";
import { InfoPools, Positions } from "components/liquidity/index";
import { Box, Button, Typography } from "components/Mui";
import { type UnderLineTab, UnderLineTabList } from "components/TabPanel";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import i18n from "i18n/index";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

  const [loadedTabs, setLoadedTabs] = useState<Array<TabName>>([]);
  const { tab: activeTabName } = useParsedQueryString() as { tab: TabName | undefined };

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: undefined, token1: undefined });

  const handleTabChange = useCallback(
    (tab: UnderLineTab) => {
      if (tab.value === activeTabName) return;
      navigate(`/liquidity?tab=${tab.value}`);
    },
    [navigate, activeTabName],
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
      <div className="liquidity-page-heading border-b border-base-300 pb-8">
        <Typography
          sx={{ color: "text.primary", fontWeight: 600, fontSize: "32px", letterSpacing: "-0.04em", lineHeight: 1.25 }}
        >
          {t("swap.liquidity.pools.title")}
        </Typography>
        <Typography sx={{ fontSize: "14px", margin: "12px 0 0 0", lineHeight: "24px", maxWidth: "720px" }}>
          {t("swap.liquidity.description")}
        </Typography>
      </div>

      <Flex
        fullWidth
        sx={{
          margin: "28px 0 0 0",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "20px 0",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        }}
        justify="space-between"
      >
        <UnderLineTabList tabs={tabs} onChange={handleTabChange} activeTabValue={activeTab} />

        <Button className="btn btn-primary" variant="contained" onClick={loadAddLiquidity}>
          {t("swap.add.liquidity")}
        </Button>
      </Flex>

      <Box sx={{ margin: "24px 0 0 0" }}>
        <Box sx={{ display: activeTab === TabName.Positions ? "block" : "none" }}>
          {loadedTabs.includes(TabName.Positions) ? <Positions /> : null}
        </Box>

        <Box sx={{ display: activeTab === TabName.TopPools ? "block" : "none" }}>
          {loadedTabs.includes(TabName.TopPools) ? <InfoPools /> : null}
        </Box>
      </Box>
    </Wrapper>
  );
}

export default memo(Liquidity);
