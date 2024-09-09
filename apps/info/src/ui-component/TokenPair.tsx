import { Box, Typography } from "@mui/material";
import { TokenImage } from "ui-component/index";

interface TokenPairProps {
  token0Logo: string | undefined;
  token1Logo: string | undefined;
  token0Symbol: string | undefined;
  token1Symbol: string | undefined;
  token0Id: string | undefined;
  token1Id: string | undefined;
}

export function TokenPair({ token0Logo, token1Id, token0Id, token0Symbol, token1Logo, token1Symbol }: TokenPairProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
      <TokenImage logo={token0Logo} tokenId={token0Id} />
      <TokenImage logo={token1Logo} tokenId={token1Id} sx={{ margin: "0 0 0 -8px" }} />
      <Typography>{token0Symbol && token1Symbol ? `${token0Symbol}/${token1Symbol}` : "--"}</Typography>
    </Box>
  );
}
