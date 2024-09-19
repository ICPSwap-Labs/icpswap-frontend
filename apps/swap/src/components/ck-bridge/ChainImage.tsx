import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { ckBridgeChain } from "@icpswap/constants";
import { Image } from "@icpswap/ui";
import { Box, useTheme } from "components/Mui";

export interface ChainImageProps {
  token: Token | Null;
  chain: ckBridgeChain | Null;
  size?: string;
  chainSize?: string;
}

export function TokenImageWithChain({ token, chain, size = "40px", chainSize = "16px" }: ChainImageProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: size, height: size, position: "relative" }}>
      <Image src={token?.logo} sx={{ width: size, height: size }} />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          borderWidth: "2px 1px 1px 2px",
          borderRadius: "4px",
          borderColor: theme.palette.background.level2,
        }}
      >
        <Image
          src={
            chain === ckBridgeChain.icp
              ? "/images/ck-bridge-chain-icp.svg"
              : chain === ckBridgeChain.btc
              ? "/images/ck-bridge-chain-btc.svg"
              : "/images/ck-bridge-chain-eth.svg"
          }
          sx={{ width: chainSize, height: chainSize }}
        />
      </Box>
    </Box>
  );
}
