import { Flex, MainCard } from "@icpswap/ui";
import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Wrapper } from "components/index";
import { Box } from "components/Mui";
import { Erc20DissolveTransactions, Erc20MintTransactions } from "components/ck-bridge";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import { TopContent } from "components/ck-bridge/TopContent";
import { BridgeTokens } from "components/ck-bridge/BridgeTokens";
import { Erc20NetworkState } from "components/ck-bridge/erc20/NetworkState";
import { Erc20Mint } from "components/ck-bridge/erc20/Mint";
import { Erc20Dissolve } from "components/ck-bridge/erc20/Dissolve";

export interface Erc20BridgeWrapperProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onTokenChange: (token: Token, chain: BridgeChainType) => void;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  error?: string | Null;
  onBridgeChainChange: (chain: BridgeChainType) => void;
  targetTokenBridgeChain: BridgeChainType;
  bridgeType: BridgeType;
}

export function Erc20BridgeWrapper({
  token,
  bridgeType,
  bridgeChain,
  minterInfo,
  onTokenChange,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: Erc20BridgeWrapperProps) {
  const blockNumber = useBlockNumber();

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
                  <Erc20Mint token={token} minterInfo={minterInfo} blockNumber={blockNumber} />
                ) : (
                  <Erc20Dissolve token={token} minterInfo={minterInfo} />
                )}
              </Flex>

              <Erc20NetworkState token={token} minterInfo={minterInfo} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === BridgeType.mint ? (
                <Erc20MintTransactions ledger={token.address} token={token} />
              ) : (
                <Erc20DissolveTransactions token={token} />
              )}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}
