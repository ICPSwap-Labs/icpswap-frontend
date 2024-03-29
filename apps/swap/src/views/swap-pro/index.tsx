import { Box } from "@mui/material";

import HotTokens from "./HotTokens";

export default function SwapPro() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: "1440px" }}>
        <HotTokens />
      </Box>
    </Box>
  );
}
