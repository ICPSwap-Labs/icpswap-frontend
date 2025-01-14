import { Box } from "components/Mui";
import { MainCard, Flex, Wrapper } from "components/index";
import { SwapTabPanels, TABS } from "components/swap/index";

import { SwapTransactions } from "./swap/Transactions";

export default function SwapTransaction() {
  return (
    <Wrapper>
      <Flex fullWidth justify="center">
        <Flex
          vertical
          align="flex-start"
          sx={{
            width: "570px",
          }}
        >
          <MainCard
            level={1}
            sx={{
              padding: "24px 0 0 0",
              paddingBottom: "0!important",
              overflow: "visible",
              "@media(max-width: 640px)": {
                padding: "16px 0 0 0",
                paddingBottom: "0!important",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                padding: "0 24px",
                "@media(max-width: 640px)": {
                  padding: "0 16px",
                },
              }}
            >
              <SwapTabPanels currentTab={TABS.TRANSACTIONS} />
            </Box>

            <Box sx={{ margin: "16px 0 0 0" }}>
              <SwapTransactions />
            </Box>
          </MainCard>
        </Flex>
      </Flex>
    </Wrapper>
  );
}
