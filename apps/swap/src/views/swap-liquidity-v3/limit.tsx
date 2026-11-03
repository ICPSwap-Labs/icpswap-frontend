import type { Pool, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, Wrapper } from "components/index";
import { Box } from "components/Mui";
import { SwapProEntry, SwapTabPanels, TABS } from "components/swap/index";
import { LimitHelpTooltip, PlaceOrder, TransactionForSimpleMode } from "components/swap/limit-order";
import { LimitContext } from "components/swap/limit-order/context";
import { useCallback, useState } from "react";
import { useWalletIsConnected } from "store/auth/hooks";

export default function Limit() {
  const [selectedPool, setSelectedPool] = useState<Pool | Null>(null);
  const [inputToken, setInputToken] = useState<Token | Null>(null);
  const [outputToken, setOutputToken] = useState<Token | Null>(null);
  const [noLiquidity, setNoLiquidity] = useState<boolean | Null>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);
  const [inverted, setInverted] = useState(false);

  const isConnected = useWalletIsConnected();

  const handleAddKeys = useCallback((key: string) => {
    setUnavailableBalanceKeys((prevState) => [...new Set([...prevState, key])]);
  }, []);

  const handleRemoveKeys = useCallback(
    (key: string) => {
      const newKeys = [...unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      setUnavailableBalanceKeys(newKeys);
    },
    [unavailableBalanceKeys],
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
            className="swap-workspace"
            vertical
            align="flex-start"
            sx={{
              width: "1000px",
              maxWidth: "100%",
            }}
          >
            <section className="swap-trading-card">
              <div className="swap-card-toolbar flex items-center justify-between gap-3">
                <SwapTabPanels currentTab={TABS.LIMIT} />

                <Flex className="swap-toolbar-actions" gap="0 8px">
                  <SwapProEntry inputToken={inputToken} outputToken={outputToken} limit />
                  <LimitHelpTooltip />
                </Flex>
              </div>

              <Box className="swap-card-content" sx={{ margin: "32px 0 0 0" }}>
                <PlaceOrder />
              </Box>
            </section>
          </Flex>
        </Flex>

        {isConnected && noLiquidity === false ? (
          <Flex vertical fullWidth justify="center" sx={{ margin: "56px 0 0 0" }}>
            <TransactionForSimpleMode />
          </Flex>
        ) : null}
      </Wrapper>
    </LimitContext.Provider>
  );
}
