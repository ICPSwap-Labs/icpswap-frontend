import { Flex, MainCard } from "@icpswap/ui";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { Wrapper } from "components/index";
import { Box } from "components/Mui";
import { useFetchBlockNumber } from "hooks/web3/useBlockNumber";

import { TopContent } from "../TopContent";
import { BridgeTokens } from "../BridgeTokens";
import { EthNetworkState } from "./NetworkState";
import { EthMint } from "./Mint";
import { EthDissolve } from "./Dissolve";
import { MintExtraContent } from "./MintExtra";
import { EthDissolveTransactions } from "./Eth20DissolveTransactions";
import { EthMintTransactions } from "./Eth20MintTransactions";

export interface EthBridgeWrapperProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  onTokenChange: (token: Token, chain: ckBridgeChain) => void;
  minterInfo?: Erc20MinterInfo | Null;
  error?: string | Null;
  onBridgeChainChange: (chain: ckBridgeChain) => void;
  targetTokenBridgeChain: ckBridgeChain;
  bridgeType: "mint" | "dissolve";
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
  useFetchBlockNumber();

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
                  <EthMint token={token} minterInfo={minterInfo} bridgeChain={bridgeChain} />
                ) : (
                  <EthDissolve token={token} minterInfo={minterInfo} bridgeChain={bridgeChain} />
                )}
              </Flex>

              {bridgeType === "mint" ? <MintExtraContent /> : null}

              <EthNetworkState token={token} minterInfo={minterInfo} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === "mint" ? <EthMintTransactions /> : <EthDissolveTransactions />}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}
