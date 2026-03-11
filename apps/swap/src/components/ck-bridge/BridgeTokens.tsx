import { useCallback } from "react";
import { BridgeChainType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { ckBTC, ckDoge, ckETH } from "@icpswap/tokens";
import { Flex, Image } from "@icpswap/ui";
import { Box } from "components/Mui";
import { SelectButton, BridgeTokenSelector } from "components/ck-bridge";

interface BridgeTokensProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onTokenChange: (token: Token, chain: BridgeChainType) => void;
  onBridgeChainChange: (chain: BridgeChainType) => void;
  targetTokenBridgeChain: BridgeChainType;
}

export function BridgeTokens({
  token,
  bridgeChain,
  onTokenChange,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: BridgeTokensProps) {
  const handleSwitchChain = useCallback(() => {
    let newChain: BridgeChainType;

    if (bridgeChain === BridgeChainType.icp) {
      switch (token.address) {
        case ckETH.address:
          newChain = BridgeChainType.eth;
          break;
        case ckDoge.address:
          newChain = BridgeChainType.doge;
          break;
        case ckBTC.address:
          newChain = BridgeChainType.btc;
          break;
        default:
          newChain = BridgeChainType.erc20;
      }
    } else {
      newChain = BridgeChainType.icp;
    }

    onBridgeChainChange(newChain);
  }, [bridgeChain, onBridgeChainChange, token]);

  return (
    <Flex
      gap="0 8px"
      fullWidth
      sx={{
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "0 8px",
          alignItems: "enter",
        },
      }}
    >
      <BridgeTokenSelector token={token} tokenChain={bridgeChain} onChange={onTokenChange} />

      <Box
        sx={{
          "@media(max-width: 640px)": {
            padding: "8px",
          },
        }}
      >
        <Image
          sx={{
            width: "32px",
            height: "32px",
            cursor: "pointer",
            "@media(max-width: 640px)": {
              transform: "rotate(90deg)",
            },
          }}
          src="/images/ck-bridge-switch.svg"
          onClick={handleSwitchChain}
        />
      </Box>

      <SelectButton token={token} chain={targetTokenBridgeChain} />
    </Flex>
  );
}
