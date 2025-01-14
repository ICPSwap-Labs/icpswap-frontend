import { useContext, useCallback, useRef, useState, useEffect } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { SwapWrapper, type SwapWrapperRef } from "components/swap/SwapWrapper";
import SwapSettings from "components/swap/SettingIcon";
import { Reclaim, SwapContext } from "components/swap/index";
import { MainCard } from "components/index";
import { SWAP_REFRESH_KEY } from "constants/index";
import { Flex } from "@icpswap/ui";
import { LimitWrapper } from "components/swap/limit-order";
import { useParsedQueryString } from "@icpswap/hooks";
import { Null } from "@icpswap/types";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

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
  const {
    setTradePoolId,
    inputToken,
    setInputToken,
    setOutputToken,
    setActiveTab: setContextActiveTab,
  } = useContext(SwapProContext);
  const { selectedPool, noLiquidity } = useContext(SwapContext);
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

  return (
    <>
      <SwapProCardWrapper overflow="visible">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        </Box>

        <Box sx={{ margin: "10px 0 0 0" }}>
          {activeTab === Tab.Swap ? (
            <SwapWrapper
              ref={swapWrapperRef}
              ui="pro"
              onOutputTokenChange={setOutputToken}
              onTradePoolIdChange={setTradePoolId}
              onInputTokenChange={setInputToken}
            />
          ) : null}

          {activeTab === Tab.Limit ? (
            <LimitWrapper
              ui="pro"
              onOutputTokenChange={setOutputToken}
              onTradePoolIdChange={setTradePoolId}
              onInputTokenChange={setInputToken}
            />
          ) : null}
        </Box>

        {noLiquidity === false && activeTab === Tab.Swap ? (
          <MainCard level={1} sx={{ margin: "8px 0 0 0" }} padding="10px" borderRadius="12px">
            <Reclaim
              fontSize="12px"
              margin="9px"
              ui="pro"
              pool={selectedPool}
              refreshKey={SWAP_REFRESH_KEY}
              inputToken={inputToken}
              onInputTokenClick={handleInputTokenClick}
            />
          </MainCard>
        ) : null}
      </SwapProCardWrapper>
    </>
  );
}
