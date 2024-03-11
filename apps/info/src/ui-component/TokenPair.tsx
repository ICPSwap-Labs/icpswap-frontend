import { Box, Typography } from "@mui/material";
import { TokenImage } from "ui-component/index";

interface TokenPairProps {
  token0Logo: string | undefined;
  token1Logo: string | undefined;
  token0Symbol: string | undefined;
  token1Symbol: string | undefined;
}

export function TokenPair({ token0Logo, token0Symbol, token1Logo, token1Symbol }: TokenPairProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 3px", alignItems: "center" }}>
      <TokenImage src={token0Logo} />
      <TokenImage src={token1Logo} sx={{ margin: "0 0 0 -8px" }} />
      <Typography>{token0Symbol && token1Symbol ? `${token0Symbol}/${token1Symbol}` : "--"}</Typography>
    </Box>
  );
}
