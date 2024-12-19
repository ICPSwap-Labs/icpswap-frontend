import { useContext, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { t } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { PoolTransactions, UserTransactions } from "components/info/swap";
import { Holders } from "components/info/tokens";

import { SwapProCardWrapper } from "../SwapProWrapper";
import { SwapProContext } from "../context";
import { YourPositions } from "./YourPositions";
import { Positions } from "./Positions";
import { AutoRefresh } from "./AutoRefresh";
import { AddLiquidity } from "./AddLiquidity";

enum Tabs {
  ALL_TRANSACTIONS = "ALL_TRANSACTIONS",
  YOUR_TRANSACTIONS = "YOUR_TRANSACTIONS",
  YOUR_POSITIONS = "YOUR_POSITIONS",
  POSITIONS = "POSITIONS",
  TOKEN_HOLDERS = "TOKEN_HOLDERS",
}

const Menus = [
  { label: t`All Transactions`, value: Tabs.ALL_TRANSACTIONS },
  { label: t`Your Transactions`, value: Tabs.YOUR_TRANSACTIONS },
  { label: t`Your Positions`, value: Tabs.YOUR_POSITIONS },
  { label: t`Positions`, value: Tabs.POSITIONS },
  { label: t`Holders`, value: Tabs.TOKEN_HOLDERS },
];

let AUTO_REFRESH_COUNTER = 0;

export default function Transactions() {
  const theme = useTheme();
  const { tradePoolId, inputToken, outputToken, token } = useContext(SwapProContext);

  const [active, setActive] = useState<Tabs>(Tabs.ALL_TRANSACTIONS);
  const [autoRefresh, setAutoRefresh] = useState(0);

  const handleAutoRefresh = () => {
    AUTO_REFRESH_COUNTER++;
    setAutoRefresh(AUTO_REFRESH_COUNTER);
  };

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
              <Box key={e.value} className={e.value === active ? "active" : ""} onClick={() => setActive(e.value)}>
                <Typography
                  className={e.value === active ? "active" : ""}
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

        {active === Tabs.ALL_TRANSACTIONS ? <AutoRefresh trigger={handleAutoRefresh} /> : null}
        {active === Tabs.YOUR_POSITIONS ? <AddLiquidity token0={inputToken} token1={outputToken} /> : null}
      </Flex>

      <Box>
        {active === Tabs.ALL_TRANSACTIONS ? <PoolTransactions canisterId={tradePoolId} refresh={autoRefresh} /> : null}
        {active === Tabs.YOUR_TRANSACTIONS ? <UserTransactions canisterId={tradePoolId} /> : null}
        {active === Tabs.YOUR_POSITIONS ? <YourPositions canisterId={tradePoolId} /> : null}
        {active === Tabs.POSITIONS ? <Positions poolId={tradePoolId} /> : null}
        {active === Tabs.TOKEN_HOLDERS ? <Holders tokenId={token?.address} /> : null}
      </Box>
    </SwapProCardWrapper>
  );
}
