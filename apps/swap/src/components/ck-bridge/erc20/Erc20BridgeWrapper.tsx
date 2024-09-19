import { Flex, MainCard } from "@icpswap/ui";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { Wrapper } from "components/index";
import { Box } from "components/Mui";
import { Erc20DissolveTransactions, Erc20MintTransactions } from "components/ck-bridge";
import { useBlockNumber } from "hooks/web3/useBlockNumber";

import { TopContent } from "../TopContent";
import { BridgeTokens } from "../BridgeTokens";
import { Erc20NetworkState } from "./NetworkState";
import { Erc20Mint } from "./Mint";
import { Erc20Dissolve } from "./Dissolve";
import { MintExtraContent } from "./MintExtra";

export interface Erc20BridgeWrapperProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  onTokenChange: (token: Token, chain: ckBridgeChain) => void;
  minterInfo?: Erc20MinterInfo | Null;
  error?: string | Null;
  onBridgeChainChange: (chain: ckBridgeChain) => void;
  targetTokenBridgeChain: ckBridgeChain;
  bridgeType: "mint" | "dissolve";
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

                {bridgeType === "mint" ? (
                  <Erc20Mint
                    token={token}
                    minterInfo={minterInfo}
                    bridgeChain={bridgeChain}
                    blockNumber={blockNumber}
                  />
                ) : (
                  <Erc20Dissolve token={token} minterInfo={minterInfo} bridgeChain={bridgeChain} />
                )}
              </Flex>

              {bridgeType === "mint" ? <MintExtraContent /> : null}

              <Erc20NetworkState token={token} minterInfo={minterInfo} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === "mint" ? (
                <Erc20MintTransactions ledger={token.address} />
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
