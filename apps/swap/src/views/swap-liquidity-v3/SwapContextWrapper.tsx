import { useCallback, useRef, useContext } from "react";
import { Box } from "components/Mui";
import { MainCard, Flex } from "components/index";
import {
  SwapWrapper,
  type SwapWrapperRef,
  Reclaim,
  SwapUIWrapper,
  CreatePool,
  SwapTabPanels,
  TABS,
  SwapProEntry,
  SwapSettings,
  SwapContext,
} from "components/swap/index";
import { useConnectorStateConnected } from "store/auth/hooks";
import { SWAP_REFRESH_KEY } from "constants/index";
import { parseTokenAmount } from "@icpswap/utils";

export function SwapContextWrapper() {
  const { cachedPool, inputToken, outputToken, noLiquidity } = useContext(SwapContext);

  const isConnected = useConnectorStateConnected();

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
                pool={cachedPool}
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
  );
}
