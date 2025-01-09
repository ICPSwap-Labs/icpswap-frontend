import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { t } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { PoolTransactions, UserTransactions } from "components/info/swap";
import { Holders } from "components/info/tokens";
import { LimitOrdersTable, LimitHistoryTable } from "components/swap/limit-order/index";

import { SwapProCardWrapper } from "../SwapProWrapper";
import { SwapProContext } from "../context";
import { YourPositions } from "./YourPositions";
import { Positions } from "./Positions";
import { AutoRefresh } from "./AutoRefresh";
import { AddLiquidity } from "./AddLiquidity";

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
}

const Menus = [
  {
    label: t`Transactions`,
    value: Tabs.TRANSACTIONS,
    subMenus: [
      { label: t`All Transactions`, value: Tabs.ALL_TRANSACTIONS },
      { label: t`Your Transactions`, value: Tabs.YOUR_TRANSACTIONS },
    ],
  },
  {
    label: t`Positions`,
    value: Tabs.POSITIONS,
    subMenus: [
      { label: t`Positions`, value: Tabs.POSITIONS },
      { label: t`Your Positions`, value: Tabs.YOUR_POSITIONS },
    ],
  },
  {
    label: t`Limit`,
    value: Tabs.LIMIT,
    subMenus: [
      { label: t`Pending`, value: Tabs.LIMIT_PENDING },
      { label: t`History`, value: Tabs.LIMIT_HISTORY },
    ],
  },
  { label: t`Holders`, value: Tabs.TOKEN_HOLDERS },
];

let AUTO_REFRESH_COUNTER = 0;

export default function Transactions() {
  const theme = useTheme();
  const { tradePoolId, inputToken, outputToken, token, activeTab: contextActiveTab } = useContext(SwapProContext);

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
    if (contextActiveTab === "SWAP") {
      handleTabClick(Tabs.TRANSACTIONS);
    } else {
      handleTabClick(Tabs.LIMIT);
    }
  }, [contextActiveTab, handleTabClick]);

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
          {subMenus?.map((subMenu) => (
            <Box
              key={subMenu.value}
              className={subMenu.value === activeSubTab ? "active" : ""}
              onClick={() => setActiveSubTab(subMenu.value)}
            >
              <Typography
                className={subMenu.value === activeSubTab ? "active" : ""}
                sx={{
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  borderRadius: "40px",
                  padding: "8px 16px",
                  border: subMenu.value === activeSubTab ? `1px solid ${theme.palette.border["3"]}` : "none",
                  "&.active": {
                    color: "text.primary",
                    fontWeight: 500,
                  },
                }}
              >
                {subMenu.label}
              </Typography>
            </Box>
          ))}
        </Flex>
      ) : null}

      <Box>
        {activeSubTab === Tabs.ALL_TRANSACTIONS ? (
          <PoolTransactions canisterId={tradePoolId} refresh={autoRefresh} />
        ) : null}
        {activeSubTab === Tabs.YOUR_TRANSACTIONS ? <UserTransactions poolId={tradePoolId} /> : null}
        {activeSubTab === Tabs.YOUR_POSITIONS ? <YourPositions poolId={tradePoolId} /> : null}
        {activeSubTab === Tabs.POSITIONS ? <Positions poolId={tradePoolId} /> : null}
        {activeTab === Tabs.TOKEN_HOLDERS ? <Holders tokenId={token?.address} /> : null}
        {activeSubTab === Tabs.LIMIT_PENDING ? <LimitOrdersTable poolId={tradePoolId} /> : null}
        {activeSubTab === Tabs.LIMIT_HISTORY ? <LimitHistoryTable poolId={tradePoolId} /> : null}
      </Box>
    </SwapProCardWrapper>
  );
}
