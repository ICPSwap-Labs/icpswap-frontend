import { useState, useCallback } from "react";
import { Box } from "components/Mui";
import { MainCard, Flex, Wrapper } from "components/index";
import { CreatePool, SwapTabPanels, TABS } from "components/swap/index";
import { LimitContext } from "components/swap/limit-order/context";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useConnectorStateConnected } from "store/auth/hooks";
import { UserLimitPanel, LimitOrders, PlaceOrder, GuidePanel } from "components/swap/limit-order";

export default function Limit() {
  const [selectedPool, setSelectedPool] = useState<Pool | Null>(null);
  const [inputToken, setInputToken] = useState<Token | Null>(null);
  const [outputToken, setOutputToken] = useState<Token | Null>(null);
  const [noLiquidity, setNoLiquidity] = useState<boolean | Null>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);
  const [showLimitOrders, setShowLimitOrders] = useState(false);
  const [inverted, setInverted] = useState(false);

  const isConnected = useConnectorStateConnected();

  const handleAddKeys = useCallback(
    (key: string) => {
      setUnavailableBalanceKeys((prevState) => [...new Set([...prevState, key])]);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  const handleRemoveKeys = useCallback(
    (key: string) => {
      const newKeys = [...unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      setUnavailableBalanceKeys(newKeys);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  return (
    <LimitContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        setNoLiquidity,
        noLiquidity,
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
        inverted,
        setInverted,
      }}
    >
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
                padding: "24px",
                paddingBottom: "24px",
                overflow: "visible",
                "@media(max-width: 640px)": {
                  padding: "16px",
                  paddingBottom: "16px",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  padding: "0",
                  "@media(max-width: 640px)": {
                    padding: "0",
                  },
                }}
              >
                <SwapTabPanels currentTab={TABS.LIMIT} />
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                {showLimitOrders ? (
                  <LimitOrders pool={selectedPool} onBack={() => setShowLimitOrders(false)} />
                ) : (
                  <PlaceOrder />
                )}
              </Box>
            </MainCard>

            <Box mt="8px" sx={{ width: "100%" }}>
              <GuidePanel />
            </Box>

            {isConnected && showLimitOrders === false ? (
              <UserLimitPanel onClick={() => setShowLimitOrders(true)} />
            ) : null}

            {isConnected && noLiquidity === true ? (
              <CreatePool inputToken={inputToken} outputToken={outputToken} />
            ) : null}
          </Flex>
        </Flex>
      </Wrapper>
    </LimitContext.Provider>
  );
}
