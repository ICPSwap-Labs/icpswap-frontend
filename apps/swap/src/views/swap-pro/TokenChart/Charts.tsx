import { useContext, useMemo } from "react";
import { Box, useTheme } from "components/Mui";
import { TokenCharts } from "@icpswap/ui";

import { SwapProContext } from "../context";

export default function TokenChartInfo() {
  const theme = useTheme();

  const { inputToken, outputToken, token } = useContext(SwapProContext);

  const priceToggles = useMemo(() => {
    if (!inputToken || !outputToken) return undefined;
    return [inputToken, outputToken].map((e) => ({ label: e.symbol, id: e.address }));
  }, [inputToken, outputToken]);

  return (
    <Box
      sx={{
        margin: "22px 0 0 0",
        background: theme.palette.background.level3,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        overflow: "hidden",
        "@media(max-width: 640px)": {
          margin: "0",
        },
      }}
    >
      <TokenCharts canisterId={token?.address} background={3} borderRadius="0px" priceToggles={priceToggles} />
    </Box>
  );
}
