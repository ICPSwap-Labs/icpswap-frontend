import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { Box } from "components/Mui";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Flex, MainCard } from "@icpswap/ui";
import { Wrapper } from "components/index";
import { useBridgeTokenBalance, useBtcDepositAddress, useBtcCurrentBlock } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useRefreshTriggerManager } from "hooks/index";

import { TopContent } from "../TopContent";
import { BridgeTokens } from "../BridgeTokens";
import { BtcBridgeMint } from "./Mint";
import { BtcBridgeDissolve } from "./Dissolve";
import { BtcBridgeNetworkState } from "./NetworkState";
import { DissolveTransactions } from "./DissolveTransactions";
import { MintTransactions } from "./MintTransactions";

interface BtcBridgeWrapperProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  onTokenChange: (token: Token, chain: ckBridgeChain) => void;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  bridgeType: "dissolve" | "mint";
  onBridgeChainChange: (chain: ckBridgeChain) => void;
  targetTokenBridgeChain: ckBridgeChain;
}

export function BtcBridgeWrapper({
  token,
  minterInfo,
  bridgeChain,
  onTokenChange,
  bridgeType,
  onBridgeChainChange,
  targetTokenBridgeChain,
}: BtcBridgeWrapperProps) {
  const principal = useAccountPrincipal();
  const [refreshTrigger] = useRefreshTriggerManager("BtcBalance");

  const { result: btc_address } = useBtcDepositAddress(principal?.toString());
  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo, refresh: refreshTrigger });
  const block = useBtcCurrentBlock();

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

                {bridgeType === "mint" ? (
                  <BtcBridgeMint btc_address={btc_address} token={token} balance={tokenBalance} />
                ) : (
                  <BtcBridgeDissolve token={token} bridgeChain={bridgeChain} />
                )}
              </Flex>

              <BtcBridgeNetworkState token={token} block={block} />
            </MainCard>

            <Box sx={{ margin: "12px 0 0 0" }}>
              {bridgeType === "mint" ? (
                <MintTransactions btc_address={btc_address} block={block} />
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
