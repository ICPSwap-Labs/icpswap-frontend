import { useCallback } from "react";
import { Box, Typography } from "components/Mui";
import { t } from "@lingui/macro";
import { useHistory } from "react-router-dom";
import { Flex } from "@icpswap/ui";

export enum TABS {
  SWAP = "Swap",
  TRANSACTIONS = "Transactions",
  LIMIT = "Limit",
}

const Tabs = [
  { value: TABS.SWAP, label: t`Swap`, path: "/swap" },
  { value: TABS.LIMIT, label: t`Limit`, path: "/swap/limit" },
  { value: TABS.TRANSACTIONS, label: t`Transactions`, path: "/swap/transaction" },
];

export interface SwapTabPanelsProps {
  currentTab: TABS;
}

export function SwapTabPanels({ currentTab }: SwapTabPanelsProps) {
  const history = useHistory();

  const handleTabChange = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  return (
    <Flex
      gap="0 24px"
      sx={{
        "@media(max-width: 640px)": {
          gap: "0 12px",
        },
      }}
    >
      {Tabs.map((tab) => (
        <Box
          key={tab.value}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => handleTabChange(tab.path)}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: currentTab === tab.value ? 600 : 400,
              color: currentTab === tab.value ? "text.primary" : "text.secondary",
            }}
          >
            {tab.label}
          </Typography>
        </Box>
      ))}
    </Flex>
  );
}
