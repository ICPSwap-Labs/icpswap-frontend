import { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { SwapWrapper } from "components/swap/SwapWrapper";
import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

export default function Swap() {
  const { setTokenId, setTrade } = useContext(SwapProContext);

  return (
    <SwapProCardWrapper>
      <Typography color="text.primary" fontSize="18px" fontWeight={600} align="center">
        ICPSwap
      </Typography>

      <Box sx={{ margin: "10px 0 0 0" }}>
        <SwapWrapper ui="pro" onOutputTokenChange={setTokenId} onTradeChange={setTrade} />
      </Box>
    </SwapProCardWrapper>
  );
}
