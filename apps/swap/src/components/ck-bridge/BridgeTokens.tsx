import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { ckETH } from "@icpswap/tokens";
import { useCallback } from "react";
import { Flex, Image } from "@icpswap/ui";
import { SelectButton, BridgeTokenSelector } from "components/ck-bridge";

interface BridgeTokensProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  onTokenChange: (token: Token, chain: ckBridgeChain) => void;
  onBridgeChainChange: (chain: ckBridgeChain) => void;
  targetTokenBridgeChain: ckBridgeChain;
}

export function BridgeTokens({
  token,
  bridgeChain,
  onTokenChange,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: BridgeTokensProps) {
  const handleSwitchChain = useCallback(() => {
    onBridgeChainChange(
      bridgeChain === ckBridgeChain.icp
        ? token.address === ckETH.address
          ? ckBridgeChain.eth
          : ckBridgeChain.btc
        : ckBridgeChain.icp,
    );
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
      <SelectButton token={token} chain={targetTokenBridgeChain} />
    </Flex>
  );
}
