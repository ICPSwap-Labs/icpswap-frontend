import { useCallback, useRef, useContext } from "react";
import { Box } from "components/Mui";
import { MainCard, Flex } from "components/index";
import {
  SwapWrapper,
  type SwapWrapperRef,
  SwapUIWrapper,
  CreatePool,
  SwapTabPanels,
  TABS,
  SwapProEntry,
  SwapSettings,
  SwapContext,
  SwapTransactions,
} from "components/swap/index";
import { ReclaimTokensInPool } from "components/swap/reclaim/Reclaim";
import { useWalletIsConnected } from "store/auth/hooks";
import { SWAP_RECLAIM_REFRESH } from "constants/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ToReclaim } from "components/swap/reclaim/ToReclaim";

export function SwapContextWrapper() {
  const { cachedPool, inputToken, outputToken, noLiquidity } = useContext(SwapContext);

  const isConnected = useWalletIsConnected();

  const swapWrapperRef = useRef<SwapWrapperRef>(null);

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [swapWrapperRef, inputToken],
  );

  return (
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
              <SwapTabPanels currentTab={TABS.SWAP} />

              <Flex gap="0 4px">
                <SwapTransactions />
                <SwapProEntry inputToken={inputToken} outputToken={outputToken} />
                <SwapSettings type="swap" />
              </Flex>
            </Box>

            <Box sx={{ margin: "16px 0 0 0" }}>
              <SwapWrapper ref={swapWrapperRef} />
            </Box>
          </MainCard>

          {isConnected && noLiquidity === false ? (
            <Flex
              vertical
              gap="8px 0"
              sx={{
                margin: "8px 0 0 0",
              }}
            >
              <ReclaimTokensInPool
                pool={cachedPool}
                refreshKey={SWAP_RECLAIM_REFRESH}
                onInputTokenClick={handleInputTokenClick}
                inputToken={inputToken}
              />

              {cachedPool ? <ToReclaim poolId={cachedPool.id} /> : null}
            </Flex>
          ) : null}

          {isConnected && noLiquidity === true ? (
            <CreatePool inputToken={inputToken} outputToken={outputToken} />
          ) : null}
        </Box>
      </Flex>
    </SwapUIWrapper>
  );
}
