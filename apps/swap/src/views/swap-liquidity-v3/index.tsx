import { useState, memo, useCallback, useRef } from "react";
import { Box } from "components/Mui";
import { MainCard, Flex } from "components/index";
import {
  SwapWrapper,
  type SwapWrapperRef,
  Reclaim,
  SwapContext,
  SwapUIWrapper,
  CreatePool,
  SwapTabPanels,
  TABS,
  SwapProEntry,
  SwapSettings,
} from "components/swap/index";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useConnectorStateConnected } from "store/auth/hooks";
import { SWAP_REFRESH_KEY } from "constants/index";
import { parseTokenAmount } from "@icpswap/utils";

export function SwapMain() {
  const [usdValueChange, setUSDValueChange] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | Null>(null);
  const [inputToken, setInputToken] = useState<Token | Null>(null);
  const [outputToken, setOutputToken] = useState<Token | Null>(null);
  const [noLiquidity, setNoLiquidity] = useState<boolean | Null>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);

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

  const swapWrapperRef = useRef<SwapWrapperRef>(null);

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [swapWrapperRef, inputToken],
  );

  return (
    <SwapContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        usdValueChange,
        setUSDValueChange,
        setNoLiquidity,
        noLiquidity,
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
      }}
    >
      <SwapUIWrapper>
        <Flex fullWidth justify="center" align="flex-start">
          <Box
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
                <SwapTabPanels currentTab={TABS.SWAP} />

                <Flex gap="0 4px">
                  <SwapSettings type="swap" />
                  <SwapProEntry inputToken={inputToken} outputToken={outputToken} />
                </Flex>
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                <SwapWrapper ref={swapWrapperRef} />
              </Box>
            </MainCard>

            {isConnected && noLiquidity === false ? (
              <Box
                mt="8px"
                sx={{
                  width: "100%",
                  background: "#111936",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <Reclaim
                  pool={selectedPool}
                  refreshKey={SWAP_REFRESH_KEY}
                  onInputTokenClick={handleInputTokenClick}
                  inputToken={inputToken}
                  fontSize="12px"
                />
              </Box>
            ) : null}

            {isConnected && noLiquidity === true ? (
              <CreatePool inputToken={inputToken} outputToken={outputToken} />
            ) : null}
          </Box>
        </Flex>
      </SwapUIWrapper>
    </SwapContext.Provider>
  );
}

export default memo(SwapMain);
