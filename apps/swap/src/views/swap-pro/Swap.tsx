import { useContext, useCallback, useRef, useState, useEffect } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { SwapContext, SwapSettings, SwapWrapper, type SwapWrapperRef } from "components/swap/index";
import { SWAP_REFRESH_KEY } from "constants/index";
import { Flex } from "@icpswap/ui";
import { LimitWrapper } from "components/swap/limit-order";
import { useParsedQueryString } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { SwapProContext, SwapProCardWrapper } from "components/swap/pro";
import { ReclaimTokensInPool } from "components/swap/reclaim/Reclaim";
import { useConnectorStateConnected } from "store/auth/hooks";
import { ToReclaim } from "components/swap/reclaim/ToReclaim";

enum Tab {
  Swap = "Swap",
  Limit = "Limit",
}

const tabs = [
  { value: Tab.Swap, label: Tab.Swap },
  { value: Tab.Limit, label: Tab.Limit },
];

export default function Swap() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const swapWrapperRef = useRef<SwapWrapperRef>(null);
  const { setActiveTab: setContextActiveTab } = useContext(SwapProContext);
  const { setPoolId, selectedPool, inputToken, setInputToken, setOutputToken, noLiquidity } = useContext(SwapContext);
  const { tab: tabFromUrl } = useParsedQueryString() as { tab: Tab | Null };

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Swap);

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [swapWrapperRef, inputToken],
  );

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    setContextActiveTab(activeTab === Tab.Swap ? "SWAP" : "LIMIT");
  }, [activeTab]);

  const isConnected = useConnectorStateConnected();

  return (
    <>
      <SwapProCardWrapper overflow="visible">
        <Flex vertical gap="8px 0" align="flex-start">
          <Flex fullWidth justify="space-between" align="flex-start">
            <Flex gap="0 16px">
              {tabs.map((tab) => (
                <Typography
                  key={tab.value}
                  sx={{
                    color: activeTab === tab.value ? "text.primary" : "text.secondary",
                    fontSize: "16px",
                    fontWeight: activeTab === tab.value ? 600 : 400,
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </Typography>
              ))}
            </Flex>

            {activeTab === Tab.Swap ? (
              <SwapSettings ui="pro" type="swap" position={matchDownSM ? "right" : "left"} />
            ) : null}
          </Flex>

          <Box>
            {activeTab === Tab.Swap ? <SwapWrapper ref={swapWrapperRef} ui="pro" /> : null}

            {activeTab === Tab.Limit ? (
              <LimitWrapper
                ui="pro"
                onOutputTokenChange={setOutputToken}
                onTradePoolIdChange={setPoolId}
                onInputTokenChange={setInputToken}
              />
            ) : null}
          </Box>

          {isConnected && noLiquidity === false && activeTab === Tab.Swap ? (
            <>
              <ReclaimTokensInPool
                pool={selectedPool}
                refreshKey={SWAP_REFRESH_KEY}
                onInputTokenClick={handleInputTokenClick}
                inputToken={inputToken}
                ui="pro"
              />

              {selectedPool ? <ToReclaim poolId={selectedPool.id} ui="pro" fontSize="12px" /> : null}
            </>
          ) : null}
        </Flex>
      </SwapProCardWrapper>
    </>
  );
}
