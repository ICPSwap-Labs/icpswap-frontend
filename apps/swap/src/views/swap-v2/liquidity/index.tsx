import { Grid } from "@mui/material";
import { SwapV2Wrapper } from "components/swap/SwapUIWrapper";
import LiquidityPoolIntro from "components/swap/LiquidityPoolIntro";
import Positions from "./Positions";
import PoolList from "./PoolList";

export default function Liquidity() {
  return (
    <SwapV2Wrapper>
      <>
        <PoolList />
        <Grid container mt={4} spacing={2}>
          <Grid item xs={12} lg={6}>
            <LiquidityPoolIntro />
          </Grid>
          <Positions />
        </Grid>
      </>
    </SwapV2Wrapper>
  );
}
