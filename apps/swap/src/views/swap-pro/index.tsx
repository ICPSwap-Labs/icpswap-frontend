import { Box } from "@mui/material";

import HotTokens from "./HotTokens";
import Swap from "./Swap";

export default function SwapPro() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: "1440px" }}>
        <HotTokens />

        <Box sx={{ margin: "8px 0 0 0", display: "flex", gap: "0 8px" }}>
          <Box sx={{ width: "350px", display: "flex", flexDirection: "column", gap: "8px 0" }}>
            <Swap />
          </Box>
          <Box sx={{ flex: 1 }}>456</Box>
        </Box>
      </Box>
    </Box>
  );
}
