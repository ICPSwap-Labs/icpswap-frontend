import { useCallback, useState, useContext, useEffect } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { TabPanel, Tab } from "components/index";
import { useTranslation } from "react-i18next";
import { SelectPair } from "components/Select/SelectPair";
import { LimitContext } from "components/swap/limit-order/context";

import { PendingList } from "./pending";
import { HistoryList } from "./history";

export function TransactionForSimpleMode() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { selectedPool } = useContext(LimitContext);
  const [activeTab, setActiveTab] = useState("Pending");

  const handleTableChange = useCallback((tab: Tab) => {
    setActiveTab(tab.key);
  }, []);

  const [pair, setPair] = useState<Null | string>(null);

  const handlePairChange = useCallback(
    (id: string | undefined) => {
      setPair(id);
    },
    [setPair],
  );

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
          />
        </Box>

        <Flex
          vertical
          gap="8px 0"
          align="flex-end"
          sx={{
            width: "fit-content",
            display: activeTab === "Pending" ? "flex" : "none",
            "@media(max-width: 640px)": {
              alignItems: "flex-start",
            },
          }}
        >
          <Flex
            gap="0 4px"
            sx={{
              minWidth: "240px",
              width: "fit-content",
              "@media(max-width: 640px)": {
                justifyContent: "flex-start",
              },
            }}
            justify="flex-end"
          >
            <Typography>{t("common.select.pair.colon")}</Typography>
            <SelectPair
              value={pair}
              panelPadding="0"
              showClean={false}
              onPairChange={handlePairChange}
              search
              allPair
              showBackground={false}
            />
          </Flex>

          {pair === "ALL PAIR" ? (
            <Typography sx={{ fontSize: "12px" }}>Fetching multiple limit orders may take some time.</Typography>
          ) : null}
        </Flex>
      </Flex>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ paddingBottom: "4px" }}>
          {activeTab === "Pending" ? <PendingList pair={pair} /> : <HistoryList />}
        </Box>
      </Box>
    </>
  );
}
