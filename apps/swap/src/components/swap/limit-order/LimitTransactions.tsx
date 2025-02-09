import { useCallback, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Pool } from "@icpswap/swap-sdk";
import { ArrowLeft } from "react-feather";
import { Null } from "@icpswap/types";
import { TabPanel, Tab } from "components/index";
import { useTranslation } from "react-i18next";

import { LimitOrders } from "./LimitOrders";
import { LimitHistory } from "./LimitHistory";

export interface LimitTransactionsProps {
  ui?: "pro" | "normal";
  pool: Pool | Null;
  onBack: () => void;
}

export function LimitTransactions({ ui = "normal", pool, onBack }: LimitTransactionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState("Pending");

  const handleTableChange = useCallback((tab: Tab) => {
    setActiveTab(tab.key);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ui === "pro" ? "6px 0" : "6px 0" }}>
      <Flex justify="space-between">
        <Flex gap="0 8px" sx={{ cursor: "pointer" }} onClick={onBack}>
          <ArrowLeft size={18} />
          <Typography>{t("common.back")}</Typography>
        </Flex>
      </Flex>

      <Flex sx={{ margin: "24px 0 0 0" }} fullWidth justify="center">
        <TabPanel
          active={activeTab}
          borderRadius="12px"
          size="small"
          tabs={[
            { value: t`Pending`, key: "Pending" },
            { value: t`History`, key: "History" },
          ]}
          bg0={theme.palette.background.level2}
          bg1={theme.palette.background.level1}
          padding0="2px"
          padding1="8px 12px"
          onChange={handleTableChange}
        />
      </Flex>

      {activeTab === "Pending" ? <LimitOrders ui={ui} pool={pool} /> : <LimitHistory />}
    </Box>
  );
}
