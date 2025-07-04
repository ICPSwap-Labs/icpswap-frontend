import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme, Button } from "components/Mui";
import { useParsedQueryString } from "@icpswap/hooks";
import { Flex, Wrapper } from "components/index";
import { InfoPools, Positions } from "components/liquidity/index";
import { useHistory } from "react-router-dom";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import { useTranslation } from "react-i18next";
import i18n from "i18n/index";

enum TabName {
  TopPools = "TopPools",
  Positions = "Positions",
}

const tabs = [
  { label: i18n.t("liquidity.your.positions"), value: TabName.Positions },
  { label: i18n.t("swap.top.pools"), value: TabName.TopPools },
];

interface TabProps {
  label: ReactNode;
  value: TabName;
  active?: boolean;
  onClick: (value: TabName) => void;
}

function Tab({ label, value, active, onClick }: TabProps) {
  const theme = useTheme();

  return (
    <Typography
      className={`${active ? "active" : ""}`}
      sx={{
        position: "relative",
        color: active ? "text.primary" : "text.secondary",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: "18px",
        "&.active": {
          "&:after": {
            position: "absolute",
            display: "block",
            content: '""',
            width: "100%",
            height: "3px",
            top: "25px",
            background: theme.colors.secondaryMain,
          },
        },
        "@media(max-width: 640px)": {
          fontSize: "16px",
          lineHeight: "16px",
        },
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </Typography>
  );
}

export default function Liquidity() {
  const { t } = useTranslation();
  const [loadedTabs, setLoadedTabs] = useState<Array<TabName>>([]);
  const history = useHistory();
  const { tab } = useParsedQueryString() as { tab: TabName | undefined };

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: undefined, token1: undefined });

  const handleTab = useCallback(
    (value: TabName) => {
      history.push(`/liquidity?tab=${value}`);
    },
    [history],
  );

  const activeTab = useMemo(() => {
    return tab ?? TabName.Positions;
  }, [tab]);

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
          <Flex gap="0 33px">
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                onClick={() => handleTab(tab.value)}
                active={activeTab === tab.value}
              />
            ))}
          </Flex>

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
