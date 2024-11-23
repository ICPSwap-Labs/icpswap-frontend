import { useContext, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { t } from "@lingui/macro";

import { SwapProCardWrapper } from "../SwapProWrapper";
import { SwapProContext } from "../context";
import { PoolTransactions } from "./PoolTransactions";
import { UserTransactions } from "./UserTransactions";
import { YourPositions } from "./YourPositions";
import { Positions } from "./Positions";
import { AutoRefresh } from "./AutoRefresh";
import { AddLiquidity } from "./AddLiquidity";

enum Tabs {
  ALL_TRANSACTIONS = "ALL_TRANSACTIONS",
  YOUR_TRANSACTIONS = "YOUR_TRANSACTIONS",
  YOUR_POSITIONS = "YOUR_POSITIONS",
  POSITIONS = "POSITIONS",
}

const Menus = [
  { label: t`All Transactions`, value: Tabs.ALL_TRANSACTIONS },
  { label: t`Your Transactions`, value: Tabs.YOUR_TRANSACTIONS },
  { label: t`Your Positions`, value: Tabs.YOUR_POSITIONS },
  { label: t`Positions`, value: Tabs.POSITIONS },
];

let AUTO_REFRESH_COUNTER = 0;

export default function Transactions() {
  const theme = useTheme();
  const { tradePoolId, inputToken, outputToken } = useContext(SwapProContext);

  const [active, setActive] = useState<Tabs>(Tabs.ALL_TRANSACTIONS);
  const [autoRefresh, setAutoRefresh] = useState(0);

  const handleAutoRefresh = () => {
    AUTO_REFRESH_COUNTER++;
    setAutoRefresh(AUTO_REFRESH_COUNTER);
  };

  return (
    <SwapProCardWrapper padding="16px 0px">
      <Box
        sx={{
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "12px 0",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "fit-content",
            background: theme.palette.background.level1,
            padding: "4px",
            borderRadius: "15px",
          }}
        >
          {Menus.map((e) => (
            <Box
              key={e.value}
              className={e.value === active ? "active" : ""}
              sx={{
                cursor: "pointer",
                padding: "10px 10px",
                borderRadius: "12px",
                "&.active": {
                  background: theme.palette.background.level3,
                },
                "@media(max-width: 640px)": {
                  padding: "6px",
                },
              }}
              onClick={() => setActive(e.value)}
            >
              <Typography
                className={e.value === active ? "active" : ""}
                sx={{
                  "&.active": {
                    color: "text.primary",
                    fontWeight: 500,
                  },
                  "@media(max-width: 640px)": {
                    fontSize: "11px",
                  },
                }}
              >
                {e.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {active === Tabs.ALL_TRANSACTIONS ? <AutoRefresh trigger={handleAutoRefresh} /> : null}
        {active === Tabs.YOUR_POSITIONS ? <AddLiquidity token0={inputToken} token1={outputToken} /> : null}
      </Box>

      <Box sx={{ margin: "10px 0 0 0" }}>
        {active === Tabs.ALL_TRANSACTIONS ? <PoolTransactions canisterId={tradePoolId} refresh={autoRefresh} /> : null}
        {active === Tabs.YOUR_TRANSACTIONS ? <UserTransactions canisterId={tradePoolId} /> : null}
        {active === Tabs.YOUR_POSITIONS ? <YourPositions canisterId={tradePoolId} /> : null}
        {active === Tabs.POSITIONS ? <Positions poolId={tradePoolId} /> : null}
      </Box>
    </SwapProCardWrapper>
  );
}
