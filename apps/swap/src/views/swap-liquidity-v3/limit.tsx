import type { Pool, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, MainCard, Wrapper } from "components/index";
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
            vertical
            align="flex-start"
            sx={{
              width: "570px",
            }}
          >
            <MainCard
              level={1}
              sx={{
                padding: "16px",
                paddingBottom: "16px",
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
                  height: "32px",
                  "@media(max-width: 640px)": {
                    padding: "0",
                  },
                }}
              >
                <SwapTabPanels currentTab={TABS.LIMIT} />

                <Flex gap="0 4px">
                  <SwapProEntry inputToken={inputToken} outputToken={outputToken} limit />
                  <LimitHelpTooltip />
                </Flex>
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                <PlaceOrder />
              </Box>
            </MainCard>
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
