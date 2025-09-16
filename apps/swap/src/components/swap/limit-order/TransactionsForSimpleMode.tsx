import { useCallback, useState, useContext, useEffect } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { TabPanel, Tab } from "components/index";
import { useTranslation } from "react-i18next";
import { LimitContext } from "components/swap/limit-order/context";
import { PendingList } from "components/swap/limit-order/pending";
import { HistoryList } from "components/swap/limit-order/history";
import { LimitPendingTabOptions } from "components/swap/limit-order/LimitPendingTabOptions";

enum LimitTab {
  Pending = "Pending",
  History = "History",
}

export function TransactionForSimpleMode() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedPool } = useContext(LimitContext);
  const [activeTab, setActiveTab] = useState(LimitTab.Pending);
  const [pair, setPair] = useState<Null | string>(null);

  const handleTableChange = useCallback((tab: Tab) => {
    setActiveTab(tab.key);
  }, []);

  useEffect(() => {
    if (selectedPool) {
      setPair(selectedPool.id);
    }
  }, [selectedPool]);

  return (
    <>
      <Flex
        fullWidth
        justify="space-between"
        sx={{
          padding: "0 0 16px 0",
          borderBottom: `1px solid ${theme.palette.background.level4}`,
          "@media(max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px 0",
          },
        }}
      >
        <Box>
          <TabPanel
            active={activeTab}
            borderRadius="12px"
            size="small"
            tabs={[
              { value: t("common.pending"), key: "Pending" },
              { value: t("common.history"), key: "History" },
            ]}
            bg0={theme.palette.background.level1}
            bg1={theme.palette.background.level3}
            padding0="2px"
            padding1="8px 12px"
            onChange={handleTableChange}
            fontNormal
          />
        </Box>

        <Flex
          vertical
          gap="8px 0"
          align="flex-end"
          sx={{
            width: "fit-content",
            "@media(max-width: 640px)": {
              alignItems: "flex-start",
            },
          }}
        >
          <Box sx={{ display: activeTab === LimitTab.Pending ? "block" : "none" }}>
            <LimitPendingTabOptions onPairChange={setPair} pair={pair} pool={selectedPool} />
          </Box>

          {activeTab === LimitTab.History ? <Typography>{t("swap.limit.history.description")}</Typography> : null}
        </Flex>
      </Flex>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ paddingBottom: "4px" }}>
          {activeTab === LimitTab.Pending ? <PendingList pair={pair} /> : <HistoryList />}
        </Box>
      </Box>
    </>
  );
}
