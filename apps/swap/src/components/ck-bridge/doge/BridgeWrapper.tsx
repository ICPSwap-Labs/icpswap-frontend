import { type BridgeChainType, BridgeType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Flex, MainCard } from "@icpswap/ui";
import { BridgeTokens } from "components/ck-bridge/BridgeTokens";
import { BridgeDissolve } from "components/ck-bridge/doge/Dissolve";
import { DissolveTransactions } from "components/ck-bridge/doge/DissolveTransactions";
import { Mint } from "components/ck-bridge/doge/Mint";
import { MintTransactions } from "components/ck-bridge/doge/MintTransactions";
import { BridgeNetworkState } from "components/ck-bridge/doge/NetworkState";
import { TopContent } from "components/ck-bridge/TopContent";
import { Wrapper } from "components/index";
import { Box } from "components/Mui";
import { BALANCE_REFRESH_INTERVAL } from "constants/chain-key";
import { useDogeAddress } from "hooks/ck-bridge/doge";
import { useDogeBlockNumber } from "hooks/ck-bridge/doge/useBlockNumber";
import { useActiveUserTokenBalance } from "hooks/token";

interface BridgeWrapperProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onTokenChange: (token: Token, chain: BridgeChainType) => void;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  bridgeType: BridgeType;
  onBridgeChainChange: (chain: BridgeChainType) => void;
  targetTokenBridgeChain: BridgeChainType;
}

export function DogeBridgeWrapper({
  token,
  bridgeChain,
  onTokenChange,
  bridgeType,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: BridgeWrapperProps) {
  const dogeAddress = useDogeAddress();

  const { result: tokenBalance, refetch } = useActiveUserTokenBalance({
    tokenId: token?.address,
    refetchInterval: BALANCE_REFRESH_INTERVAL,
  });

  const block = useDogeBlockNumber();

  return (
    <Wrapper>
      <Flex sx={{ width: "100%" }} justify="center">
        <Box sx={{ width: "100%", maxWidth: "716px" }}>
          <TopContent />

          <Box sx={{ margin: "40px 0 0 0" }}>
            <MainCard level={1}>
              <Flex vertical gap="8px 0" align="flex-start" fullWidth>
                <BridgeTokens
                  bridgeChain={bridgeChain}
                  targetTokenBridgeChain={targetTokenBridgeChain}
                  token={token}
                  onTokenChange={onTokenChange}
                  onBridgeChainChange={onBridgeChainChange}
                />

                {bridgeType === BridgeType.mint ? (
                  <Mint address={dogeAddress} token={token} balance={tokenBalance} refetch={refetch} />
                ) : (
                  <BridgeDissolve token={token} bridgeChain={bridgeChain} />
                )}
              </Flex>

              <BridgeNetworkState token={token} block={block} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === BridgeType.mint ? <MintTransactions address={dogeAddress} /> : <DissolveTransactions />}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}
