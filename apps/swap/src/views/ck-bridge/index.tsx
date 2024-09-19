import { useChainKeyMinterInfo } from "@icpswap/hooks";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonNullArgs } from "@icpswap/utils";
import { ckBTC, ckUSDC, ckETH } from "@icpswap/tokens";
import { Erc20BridgeWrapper, BtcBridgeWrapper, EthBridgeWrapper } from "components/ck-bridge";
import { useCallback, useMemo, useState } from "react";
import { ckETH_MINTER_ID } from "constants/ckETH";

export default function CkBridge() {
  const [token, setToken] = useState<Token>(ckUSDC);
  const [bridgeChain, setBridgeChain] = useState<ckBridgeChain>(ckBridgeChain.eth);

  const { result: minterInfo } = useChainKeyMinterInfo(ckETH_MINTER_ID);

  const bridgeTokenType = useMemo(() => {
    if (!token || !minterInfo) return;

    const erc20TokenMinterInfo = minterInfo.supported_ckerc20_tokens[0]?.find(
      (e) => e.ledger_canister_id.toString() === token.address,
    );

    return nonNullArgs(erc20TokenMinterInfo) ? "erc20" : token.address === ckETH.address ? "eth" : "btc";
  }, [token, minterInfo]);

  const bridgeType = useMemo(() => {
    return bridgeChain === ckBridgeChain.icp ? "dissolve" : "mint";
  }, [token, bridgeChain]);

  const targetTokenBridgeChain = useMemo(() => {
    return bridgeChain === ckBridgeChain.icp
      ? token.address === ckETH.address
        ? ckBridgeChain.eth
        : token.address === ckBTC.address
        ? ckBridgeChain.btc
        : ckBridgeChain.eth
      : ckBridgeChain.icp;
  }, [token, bridgeChain]);

  const handleTokenChange = useCallback((token: Token, chain: ckBridgeChain) => {
    setToken(token);
    setBridgeChain(chain);
  }, []);

  return bridgeTokenType === "erc20" ? (
    <Erc20BridgeWrapper
      token={token}
      minterInfo={minterInfo}
      bridgeChain={bridgeChain}
      targetTokenBridgeChain={targetTokenBridgeChain}
      onTokenChange={handleTokenChange}
      onBridgeChainChange={() => setBridgeChain(targetTokenBridgeChain)}
      bridgeType={bridgeType}
    />
  ) : bridgeTokenType === "btc" ? (
    <BtcBridgeWrapper
      token={token}
      minterInfo={minterInfo}
      bridgeChain={bridgeChain}
      targetTokenBridgeChain={targetTokenBridgeChain}
      onTokenChange={handleTokenChange}
      bridgeType={bridgeType}
      onBridgeChainChange={() => setBridgeChain(targetTokenBridgeChain)}
    />
  ) : bridgeTokenType === "eth" ? (
    <EthBridgeWrapper
      token={token}
      minterInfo={minterInfo}
      bridgeChain={bridgeChain}
      targetTokenBridgeChain={targetTokenBridgeChain}
      onTokenChange={handleTokenChange}
      onBridgeChainChange={() => setBridgeChain(targetTokenBridgeChain)}
      bridgeType={bridgeType}
    />
  ) : null;
}
