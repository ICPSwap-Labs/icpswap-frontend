import { type BridgeChainType, BridgeType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Flex, MainCard } from "@icpswap/ui";
import { BridgeTokens } from "components/ck-bridge/BridgeTokens";
import { EthDissolve } from "components/ck-bridge/eth/Dissolve";
import { EthDissolveTransactions } from "components/ck-bridge/eth/Eth20DissolveTransactions";
import { EthMintTransactions } from "components/ck-bridge/eth/Eth20MintTransactions";
import { EthMint } from "components/ck-bridge/eth/Mint";
import { EthNetworkState } from "components/ck-bridge/eth/NetworkState";
import { TopContent } from "components/ck-bridge/TopContent";
import { Wrapper } from "components/index";
import { Box } from "components/Mui";

export interface EthBridgeWrapperProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onTokenChange: (token: Token, chain: BridgeChainType) => void;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  error?: string | Null;
  onBridgeChainChange: (chain: BridgeChainType) => void;
  targetTokenBridgeChain: BridgeChainType;
  bridgeType: BridgeType;
}

export function EthBridgeWrapper({
  token,
  bridgeType,
  bridgeChain,
  minterInfo,
  onTokenChange,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: EthBridgeWrapperProps) {
  return (
    <Wrapper>
      <Flex sx={{ width: "100%" }} justify="center">
        <Box sx={{ width: "100%", maxWidth: "716px" }}>
          <TopContent />

          <Box sx={{ margin: "40px 0 0 0" }}>
            <MainCard level={1}>
              <Flex vertical gap="8px 0" align="flex-start" fullWidth>
                <BridgeTokens
                  token={token}
                  bridgeChain={bridgeChain}
                  onTokenChange={onTokenChange}
                  onBridgeChainChange={onBridgeChainChange}
                  targetTokenBridgeChain={targetTokenBridgeChain}
                />

                {bridgeType === BridgeType.mint ? (
                  <EthMint token={token} minterInfo={minterInfo} bridgeChain={bridgeChain} />
                ) : (
                  <EthDissolve token={token} bridgeChain={bridgeChain} />
                )}
              </Flex>

              <EthNetworkState token={token} minterInfo={minterInfo} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === BridgeType.mint ? <EthMintTransactions /> : <EthDissolveTransactions />}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}
