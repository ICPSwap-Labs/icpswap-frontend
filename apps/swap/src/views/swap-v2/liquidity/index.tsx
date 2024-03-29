import { useEffect } from "react";
import { Grid } from "@mui/material";
import { SwapV2Wrapper } from "components/swap/SwapUIWrapper";
import { useUpdatePoolTokenStandardCallback } from "hooks/swap/v2/index";
import { usePoolList } from "hooks/swap/v2/useSwapCalls";
import { usePoolStandardManager } from "store/global/hooks";
import LoadingRow from "components/Loading/LoadingRow";
import LiquidityPoolIntro from "components/swap/LiquidityPoolIntro";
import Positions from "./Positions";
import PoolList from "./PoolList";

export default function Liquidity() {
  const [isInitialed, updatePoolStandardInitialed] = usePoolStandardManager();
  const updatePoolTokenStandard = useUpdatePoolTokenStandardCallback();
  const { pools } = usePoolList();

  useEffect(() => {
    const call = async () => {
      if (pools && pools.length && !isInitialed) {
        const calls: Promise<void>[] = [];

        for (let i = 0; i < pools.length; i++) {
          const pool = pools[i];

          if (!!pool && !!pool?.pool) {
            calls.push(updatePoolTokenStandard(pool.pool, pool.token0));
            calls.push(updatePoolTokenStandard(pool.pool, pool.token1));
          }
        }

        Promise.all(calls).finally(() => {
          updatePoolStandardInitialed(true);
        });
      }
    };

    call();
  }, [pools]);

  return (
    <SwapV2Wrapper>
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
          <Grid container mt={4} spacing={2}>
            <Grid item xs={12} lg={6}>
              <LiquidityPoolIntro version="v2" />
            </Grid>
            <Positions />
          </Grid>
        </>
      )}
    </SwapV2Wrapper>
  );
}
