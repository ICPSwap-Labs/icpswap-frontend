import TokenInfo from "./Token";
import TokenCharts from "./Charts";
import { SwapProCardWrapper } from "../SwapProWrapper";

export default function TokenChartWrapper() {
  return (
    <SwapProCardWrapper padding="0px" background="level2">
      <TokenInfo />
      <TokenCharts />
    </SwapProCardWrapper>
  );
}
