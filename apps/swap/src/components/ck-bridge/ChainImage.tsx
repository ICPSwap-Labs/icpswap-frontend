import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Image } from "@icpswap/ui";
import { Box, useTheme } from "components/Mui";

export interface ChainImageProps {
  token: Token | Null;
  chain: BridgeChainType | Null;
  size?: string;
  chainSize?: string;
}

export function TokenImageWithChain({ token, chain, size = "40px", chainSize = "14px" }: ChainImageProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: size, height: size, position: "relative" }}>
      <Image src={token?.logo} sx={{ width: size, height: size }} />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          borderWidth: "2px",
          borderRadius: "4px",
          borderColor: theme.palette.background.level2,
          width: `${parseInt(chainSize) + 2}px`,
          height: `${parseInt(chainSize) + 2}px`,
          background: "#1A223F",
        }}
      >
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            src={
              chain === BridgeChainType.icp
                ? "/images/ck-bridge/chain-icp.svg"
                : chain === BridgeChainType.btc
                  ? "/images/ck-bridge/chain-btc.svg"
                  : chain === BridgeChainType.doge
                    ? "/images/ck-bridge/chain-doge.svg"
                    : "/images/ck-bridge/chain-eth.svg"
            }
            sx={{
              width: chainSize,
              height: chainSize,
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
