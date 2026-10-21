import { parseTokenAmount } from "@icpswap/utils";
import { Flex } from "components/index";
import { Box } from "components/Mui";
import {
  CreatePool,
  SwapProEntry,
  SwapSettings,
  SwapTabPanels,
  SwapTransactions,
  SwapUIWrapper,
  SwapWrapper,
  type SwapWrapperRef,
  TABS,
  useSwapStore,
} from "components/swap/index";
import { ReclaimTokensInPool } from "components/swap/reclaim/Reclaim";
import { ToReclaim } from "components/swap/reclaim/ToReclaim";
import { SWAP_RECLAIM_REFRESH } from "constants/index";
import { useCallback, useRef } from "react";
import { useWalletIsConnected } from "store/auth/hooks";

export function SwapContextWrapper() {
  const { inputToken, outputToken, noLiquidity, selectedPool } = useSwapStore();

  const isConnected = useWalletIsConnected();

  const swapWrapperRef = useRef<SwapWrapperRef>(null);

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [inputToken],
  );

  return (
    <SwapUIWrapper>
      <Flex fullWidth justify="center" align="flex-start">
        <Box
          sx={{
            width: "560px",
            maxWidth: "100%",
          }}
        >
          <section className="card swap-trading-card bg-base-100 border border-base-300">
            <div className="swap-card-toolbar flex items-center justify-between gap-3">
              <SwapTabPanels currentTab={TABS.SWAP} />

              <Flex gap="0 4px">
                <SwapTransactions />
                <SwapProEntry inputToken={inputToken} outputToken={outputToken} />
                <SwapSettings type="swap" />
              </Flex>
            </div>

            <Box sx={{ margin: "20px 0 0 0" }}>
              <SwapWrapper ref={swapWrapperRef} />
            </Box>
          </section>

          {isConnected && noLiquidity === false ? (
            <Flex
              vertical
              gap="8px 0"
              sx={{
                margin: "8px 0 0 0",
              }}
            >
              <ReclaimTokensInPool
                pool={selectedPool}
                refreshKey={SWAP_RECLAIM_REFRESH}
                onInputTokenClick={handleInputTokenClick}
                inputToken={inputToken}
              />

              {selectedPool ? <ToReclaim poolId={selectedPool.id} /> : null}
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
