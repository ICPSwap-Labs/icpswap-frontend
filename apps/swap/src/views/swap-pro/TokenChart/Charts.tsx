import { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { TokenCharts } from "@icpswap/ui";

import { SwapProContext } from "../context";

export default function TokenChartInfo() {
  const theme = useTheme() as Theme;

  const { outputToken } = useContext(SwapProContext);

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
      <TokenCharts canisterId={outputToken?.address} background={3} borderRadius="0px" />
    </Box>
  );
}
