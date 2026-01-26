import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { PoolTransactions, UserTransactions } from "components/info/swap";
import { Holders } from "components/info/tokens";
import { PendingTablePro, HistoryTablePro } from "components/swap/limit-order/index";
import { SwapProContext, SwapProCardWrapper } from "components/swap/pro";
import { SwapContext } from "components/swap";
import i18n from "i18n/index";
import { UserTransactionsEmpty } from "components/swap/UserTransactionsEmpty";
import { useScrollToTop } from "hooks/useScrollToTop";
import { Tab } from "constants/index";
import { OutlineCircleTabList } from "components/TabPanel";

import { YourPositions } from "./YourPositions";
import { Positions } from "./Positions";
import { AutoRefresh } from "./AutoRefresh";
import { AddLiquidity } from "./AddLiquidity";
import { SocialMedia } from "./SocialMedia";

enum Tabs {
  TRANSACTIONS = "TRANSACTIONS",
  ALL_TRANSACTIONS = "ALL_TRANSACTIONS",
  YOUR_TRANSACTIONS = "YOUR_TRANSACTIONS",
  POSITIONS = "POSITIONS",
  YOUR_POSITIONS = "YOUR_POSITIONS",
  ALL_POSITIONS = "ALL_POSITIONS",
  TOKEN_HOLDERS = "TOKEN_HOLDERS",
  LIMIT = "LIMIT",
  LIMIT_PENDING = "LIMIT_PENDING",
  LIMIT_HISTORY = "LIMIT_HISTORY",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
}

const Menus = [
  {
    label: i18n.t("common.transactions"),
    value: Tabs.TRANSACTIONS,
    subMenus: [
      { label: i18n.t("common.all.transactions"), value: Tabs.ALL_TRANSACTIONS },
      { label: i18n.t("common.your.transactions"), value: Tabs.YOUR_TRANSACTIONS },
    ],
  },
  {
    label: i18n.t("common.positions"),
    value: Tabs.POSITIONS,
    subMenus: [
      { label: i18n.t("common.positions"), value: Tabs.POSITIONS },
      { label: i18n.t("liquidity.your.positions"), value: Tabs.YOUR_POSITIONS },
    ],
  },
  {
    label: i18n.t("common.limit"),
    value: Tabs.LIMIT,
    subMenus: [
      { label: i18n.t("common.pending"), value: Tabs.LIMIT_PENDING },
      { label: i18n.t("common.history"), value: Tabs.LIMIT_HISTORY },
    ],
  },
  { label: i18n.t("common.holders"), value: Tabs.TOKEN_HOLDERS },
  { label: i18n.t("common.social.media"), value: Tabs.SOCIAL_MEDIA },
];

let AUTO_REFRESH_COUNTER = 0;

export default function Transactions() {
  const theme = useTheme();
  const { poolId, inputToken, outputToken } = useContext(SwapContext);
  const { token, activeTab: contextActiveTab } = useContext(SwapProContext);

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.TRANSACTIONS);
  const [activeSubTab, setActiveSubTab] = useState<Tabs | null>(Tabs.ALL_TRANSACTIONS);
  const [autoRefresh, setAutoRefresh] = useState(0);

  const handleAutoRefresh = () => {
    AUTO_REFRESH_COUNTER++;
    setAutoRefresh(AUTO_REFRESH_COUNTER);
  };

  const subMenus = useMemo(() => {
    return Menus.find((e) => e.value === activeTab)?.subMenus;
  }, [activeTab]);

  const handleTabClick = useCallback((tab: Tabs) => {
    const menu = Menus.find((e) => e.value === tab);

    if (menu && menu.subMenus) {
      setActiveSubTab(menu.subMenus[0].value);
    } else {
      setActiveSubTab(null);
    }

    setActiveTab(tab);
  }, []);

  useEffect(() => {
    if (contextActiveTab === Tab.Swap) {
      handleTabClick(Tabs.TRANSACTIONS);
    } else {
      handleTabClick(Tabs.LIMIT);
    }
  }, [contextActiveTab, handleTabClick]);

  const scrollToTop = useScrollToTop();

  return (
    <SwapProCardWrapper padding="20px 0px 0px 0px">
      <Flex
        justify="space-between"
        sx={{
          padding: "0 16px 24px 16px",
          borderBottom: `1px solid ${theme.palette.background.level1}`,
          "@media(max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px 0",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto hidden",
            "@media(max-width: 640px)": {
              width: "100%",
              padding: "0 0 16px 0",
            },
          }}
        >
          <Flex gap="20px">
            {Menus.map((e) => (
              <Box
                key={e.value}
                className={e.value === activeTab ? "active" : ""}
                onClick={() => handleTabClick(e.value)}
              >
                <Typography
                  className={e.value === activeTab ? "active" : ""}
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "16px",
                    cursor: "pointer",
                    "&.active": {
                      color: "text.primary",
                      fontWeight: 500,
                    },
                    "@media(max-width: 640px)": {
                      fontSize: "14px",
                    },
                  }}
                >
                  {e.label}
                </Typography>
              </Box>
            ))}
          </Flex>
        </Box>

        {activeSubTab === Tabs.ALL_TRANSACTIONS ? <AutoRefresh trigger={handleAutoRefresh} /> : null}
        {activeSubTab === Tabs.YOUR_POSITIONS ? <AddLiquidity token0={inputToken} token1={outputToken} /> : null}
      </Flex>

      {subMenus ? (
        <Flex sx={{ padding: "16px", gap: "0 4px", borderBottom: `1px solid ${theme.palette.background.level1}` }}>
          <OutlineCircleTabList
            tabs={subMenus as { label: string; value: string }[]}
            onChange={(tab) => setActiveSubTab(tab.value as Tabs)}
          />
        </Flex>
      ) : null}

      <Box>
        {activeSubTab === Tabs.ALL_TRANSACTIONS ? <PoolTransactions canisterId={poolId} refresh={autoRefresh} /> : null}
        {activeSubTab === Tabs.YOUR_TRANSACTIONS ? (
          <UserTransactions poolId={poolId} CustomNoData={<UserTransactionsEmpty onClick={scrollToTop} />} />
        ) : null}
        {activeSubTab === Tabs.YOUR_POSITIONS ? <YourPositions poolId={poolId} /> : null}
        {activeSubTab === Tabs.POSITIONS ? <Positions poolId={poolId} /> : null}
        {activeTab === Tabs.TOKEN_HOLDERS ? <Holders tokenId={token?.address} /> : null}
        {activeSubTab === Tabs.LIMIT_PENDING ? <PendingTablePro poolId={poolId} /> : null}
        {activeSubTab === Tabs.LIMIT_HISTORY ? <HistoryTablePro poolId={poolId} /> : null}
        {activeTab === Tabs.SOCIAL_MEDIA ? <SocialMedia /> : null}
      </Box>
    </SwapProCardWrapper>
  );
}
