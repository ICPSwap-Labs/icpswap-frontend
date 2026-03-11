import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Box } from "components/Mui";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Flex, MainCard } from "@icpswap/ui";
import { Wrapper } from "components/index";
import { useBtcDepositAddress, useBitcoinBlockNumber } from "hooks/ck-bridge/index";
import { TopContent } from "components/ck-bridge/TopContent";
import { BridgeTokens } from "components/ck-bridge/BridgeTokens";
import { BtcBridgeMint } from "components/ck-bridge/btc/Mint";
import { BtcBridgeDissolve } from "components/ck-bridge/btc/Dissolve";
import { BtcBridgeNetworkState } from "components/ck-bridge/btc/NetworkState";
import { DissolveTransactions } from "components/ck-bridge/btc/DissolveTransactions";
import { MintTransactions } from "components/ck-bridge/btc/MintTransactions";
import { useActiveUserTokenBalance } from "hooks/token";
import { BALANCE_REFRESH_INTERVAL } from "constants/chain-key";

interface BtcBridgeWrapperProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onTokenChange: (token: Token, chain: BridgeChainType) => void;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  bridgeType: BridgeType;
  onBridgeChainChange: (chain: BridgeChainType) => void;
  targetTokenBridgeChain: BridgeChainType;
}

export function BtcBridgeWrapper({
  token,
  bridgeChain,
  onTokenChange,
  bridgeType,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: BtcBridgeWrapperProps) {
  const { result: bitcoinAddress } = useBtcDepositAddress();

  const { result: balance, refetch } = useActiveUserTokenBalance({
    tokenId: token?.address,
    refetchInterval: BALANCE_REFRESH_INTERVAL,
  });
  const block = useBitcoinBlockNumber();

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
                  <BtcBridgeMint bitcoinAddress={bitcoinAddress} token={token} balance={balance} refetch={refetch} />
                ) : (
                  <BtcBridgeDissolve token={token} bridgeChain={bridgeChain} />
                )}
              </Flex>

              <BtcBridgeNetworkState token={token} block={block} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === BridgeType.mint ? (
                <MintTransactions bitcoinAddress={bitcoinAddress} />
              ) : (
                <DissolveTransactions />
              )}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
}
