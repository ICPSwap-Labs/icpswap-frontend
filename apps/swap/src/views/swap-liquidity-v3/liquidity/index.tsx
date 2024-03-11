import { useEffect } from "react";
import { Box } from "@mui/material";
import SwapWrapper from "components/swap/SwapWrapper";
import PoolList from "./PoolList";
import Positions from "./Positions";
import { useSwapPools } from "@icpswap/hooks";
import { usePoolStandardManager } from "store/global/hooks";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { TOKEN_STANDARD } from "constants/tokens";
import LiquidityPoolIntro from "components/swap/LiquidityPoolIntro";
import { TextButton, LoadingRow } from "components/index";
import { Trans } from "@lingui/macro";

export default function Liquidity() {
  const [isInitialed, updatePoolStandardInitialed] = usePoolStandardManager();

  const { result: pools } = useSwapPools();

  const updateTokenStandard = useUpdateTokenStandard();

  useEffect(() => {
    const trigger = (updatedNum: number) => {
      if (pools && updatedNum === pools.length) {
        updatePoolStandardInitialed(true);
      }
    };

    const call = () => {
      if (pools && pools.length && !isInitialed) {
        let updatedNum = 0;
        for (let i = 0; i < pools.length; i++) {
          const pool = pools[i];
          updateTokenStandard({ canisterId: pool.token0.address, standard: pool.token0.standard as TOKEN_STANDARD });
          updateTokenStandard({ canisterId: pool.token1.address, standard: pool.token1.standard as TOKEN_STANDARD });

          updatedNum++;
          trigger(updatedNum);
        }
      } else {
        if (pools && pools.length === 0) {
          updatePoolStandardInitialed(true);
        }
      }
    };

    call();
  }, [pools]);

  return (
    <SwapWrapper>
      {!isInitialed ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : (
        <>
          <PoolList />
          <Box
            sx={{
              margin: "32px 0 0 0",
              display: "flex",
              gap: "0 16px",
              "@media(max-width: 980px)": {
                flexDirection: "column",
                gap: "16px 0",
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <LiquidityPoolIntro />

              <Box sx={{ width: "100%", display: "flex", margin: "5px 0 0 0", justifyContent: "flex-end" }}>
                <TextButton to="/swap/pcm/reclaim">
                  <Trans>Withdraw unused swap pool creation fees</Trans>
                </TextButton>
              </Box>
            </Box>

            <Box sx={{ flex: 1, height: "100%" }}>
              <Positions />
            </Box>
          </Box>
        </>
      )}
    </SwapWrapper>
  );
}
