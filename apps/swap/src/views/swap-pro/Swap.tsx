import { useContext, useCallback, useRef, useEffect } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { SwapContext, SwapWrapper, type SwapWrapperRef, CreatePool, SwapSettings } from "components/swap/index";
import { SWAP_REFRESH_KEY, Tab } from "constants/index";
import { Flex } from "@icpswap/ui";
import { LimitWrapper } from "components/swap/limit-order";
import { useParsedQueryString } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { SwapProContext, SwapProCardWrapper } from "components/swap/pro";
import { ReclaimTokensInPool } from "components/swap/reclaim/Reclaim";
import { useWalletIsConnected } from "store/auth/hooks";
import { ToReclaim } from "components/swap/reclaim/ToReclaim";
import { useHistory } from "react-router-dom";

const tabs = [
  { value: Tab.Swap, label: Tab.Swap },
  { value: Tab.Limit, label: Tab.Limit },
];

export default function Swap() {
  const theme = useTheme();
  const history = useHistory();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const swapWrapperRef = useRef<SwapWrapperRef>(null);
  const { activeTab, setActiveTab } = useContext(SwapProContext);
  const { setPoolId, selectedPool, inputToken, outputToken, setInputToken, setOutputToken, noLiquidity } =
    useContext(SwapContext);

  const { tab: tabFromUrl } = useParsedQueryString() as { tab: Tab | Null };

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [swapWrapperRef, inputToken],
  );

  useEffect(() => {
    setActiveTab((tabFromUrl ?? Tab.Swap) as Tab);
  }, [tabFromUrl]);

  const handleTab = useCallback(
    (tab: Tab) => {
      history.push(`/swap/pro?tab=${tab}`);
    },
    [history],
  );

  const isConnected = useWalletIsConnected();

  return (
    <>
      <SwapProCardWrapper overflow="visible">
        <Flex vertical gap="10px" align="flex-start">
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
                  onClick={() => handleTab(tab.value)}
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

          {isConnected && noLiquidity === true ? (
            <CreatePool inputToken={inputToken} outputToken={outputToken} ui="pro" />
          ) : null}
        </Flex>
      </SwapProCardWrapper>
    </>
  );
}
