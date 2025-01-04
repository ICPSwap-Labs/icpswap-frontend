import { useState, useCallback } from "react";
import { Box } from "components/Mui";
import { MainCard, Flex } from "components/index";
import { LimitContext } from "components/swap/limit-order/context";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useConnectorStateConnected } from "store/auth/hooks";
import { UserLimitPanel, PlaceOrder, GuidePanel } from "components/swap/limit-order";

interface LimitWrapperProps {
  ui?: "pro" | "normal";
  onInputTokenChange?: (token: Token | undefined) => void;
  onOutputTokenChange?: (tokenId: Token | undefined) => void;
  onTradePoolIdChange?: (poolId: string | undefined) => void;
}

export function LimitWrapper({
  ui = "normal",
  onInputTokenChange,
  onOutputTokenChange,
  onTradePoolIdChange,
}: LimitWrapperProps) {
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
      <Flex fullWidth justify="center">
        <Flex vertical align="flex-start">
          <MainCard
            level={ui === "normal" ? 1 : 3}
            sx={{
              padding: ui === "normal" ? "24px" : "0px",
              paddingBottom: ui === "normal" ? "24px" : "0px",
              overflow: "visible",
              "@media(max-width: 640px)": {
                padding: ui === "normal" ? "16px" : "0px",
                paddingBottom: ui === "normal" ? "16px" : "0px",
              },
            }}
          >
            <Box sx={{ margin: ui === "normal" ? "16px 0 0 0" : "0px" }}>
              <PlaceOrder
                ui={ui}
                onOutputTokenChange={onOutputTokenChange}
                onTradePoolIdChange={onTradePoolIdChange}
                onInputTokenChange={onInputTokenChange}
              />
            </Box>
          </MainCard>

          {ui === "normal" ? (
            <Box mt="8px" sx={{ width: "100%" }}>
              <GuidePanel />
            </Box>
          ) : null}

          {isConnected && showLimitOrders === false && noLiquidity === false && ui === "normal" ? (
            <UserLimitPanel onClick={() => setShowLimitOrders(true)} />
          ) : null}
        </Flex>
      </Flex>
    </LimitContext.Provider>
  );
}
