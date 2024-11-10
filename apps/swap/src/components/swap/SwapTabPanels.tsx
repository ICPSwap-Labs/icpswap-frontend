import { useCallback } from "react";
import { Box, Typography } from "components/Mui";
import { t } from "@lingui/macro";
import { useHistory } from "react-router-dom";

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
    <Box>
      {Tabs.map((tab) => (
        <Box
          key={tab.value}
          sx={{
            display: "inline-block",
            margin: "0 24px 0 0",
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
    </Box>
  );
}
