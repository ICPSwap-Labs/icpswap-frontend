import { useState, memo, useCallback, useRef } from "react";
import { Grid, Box, Typography } from "components/Mui";
import { MainCard } from "components/index";
import SwapSettingIcon from "components/swap/SettingIcon";
import { t } from "@lingui/macro";
import {
  SwapWrapper,
  type SwapWrapperRef,
  Reclaim,
  SwapContext,
  SwapUIWrapper,
  CreatePool,
} from "components/swap/index";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useConnectorStateConnected } from "store/auth/hooks";
import { SWAP_REFRESH_KEY } from "constants/index";
import { parseTokenAmount } from "@icpswap/utils";

import { SwapTransactions } from "./swap/Transactions";

enum TABS {
  SWAP = "Swap",
  TRANSACTIONS = "Transactions",
}

const Tabs = [
  { value: TABS.SWAP, label: t`Swap`, component: SwapWrapper },
  { value: TABS.TRANSACTIONS, label: t`Transactions`, component: SwapTransactions },
];

export function SwapMain() {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.SWAP);
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
        <Grid container justifyContent="center">
          <Grid
            item
            sx={{
              width: "570px",
            }}
          >
            <MainCard
              level={1}
              sx={{
                padding: activeTab === TABS.TRANSACTIONS ? "24px 0 0 0" : "24px",
                paddingBottom: activeTab === TABS.TRANSACTIONS ? "0!important" : "24px",
                overflow: "visible",
                "@media(max-width: 640px)": {
                  padding: activeTab === TABS.TRANSACTIONS ? "16px 0 0 0" : "16px",
                  paddingBottom: activeTab === TABS.TRANSACTIONS ? "0!important" : "16px",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  padding: activeTab === TABS.TRANSACTIONS ? "0 24px" : "0",
                  "@media(max-width: 640px)": {
                    padding: activeTab === TABS.TRANSACTIONS ? "0 16px" : "0",
                  },
                }}
              >
                <Box>
                  {Tabs.map((tab) => (
                    <Box
                      key={tab.value}
                      sx={{
                        display: "inline-block",
                        margin: "0 24px 0 0",
                        cursor: "pointer",
                      }}
                      onClick={() => setActiveTab(tab.value)}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: activeTab === tab.value ? 600 : 400,
                          color: activeTab === tab.value ? "text.primary" : "text.secondary",
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <SwapSettingIcon type="swap" />
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                {activeTab === TABS.SWAP ? <SwapWrapper ref={swapWrapperRef} /> : null}
                {activeTab === TABS.TRANSACTIONS ? <SwapTransactions /> : null}
              </Box>
            </MainCard>

            {isConnected && noLiquidity === false ? (
              <Box
                mt="8px"
                sx={{
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
          </Grid>
        </Grid>
      </SwapUIWrapper>
    </SwapContext.Provider>
  );
}

export default memo(SwapMain);
