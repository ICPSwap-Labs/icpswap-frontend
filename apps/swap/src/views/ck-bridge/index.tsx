import { useChainKeyMinterInfo, useParsedQueryString } from "@icpswap/hooks";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonNullArgs } from "@icpswap/utils";
import { ckBTC, ckUSDC, ckETH } from "@icpswap/tokens";
import { Erc20BridgeWrapper, BtcBridgeWrapper, EthBridgeWrapper } from "components/ck-bridge";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ckETH_MINTER_ID } from "constants/ckETH";
import { useToken } from "hooks/useCurrency";
import { useHistory } from "react-router-dom";

export default function CkBridge() {
  const [token, setToken] = useState<Token>(ckUSDC);
  const [bridgeChain, setBridgeChain] = useState<ckBridgeChain>(ckBridgeChain.eth);

  const history = useHistory();

  const { chain, tokenId } = useParsedQueryString() as {
    chain: ckBridgeChain | undefined;
    tokenId: string | undefined;
  };

  const [, tokenFromUrl] = useToken(tokenId);

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

  const handleTokenChange = useCallback(
    (token: Token, chain: ckBridgeChain) => {
      history.push(`/ck-bridge?tokenId=${token.address}&chain=${chain}`);
    },
    [history],
  );

  const handleBridgeChangeChange = useCallback(() => {
    history.push(`/ck-bridge?tokenId=${tokenId ?? ckUSDC.address}&chain=${targetTokenBridgeChain}`);
  }, [targetTokenBridgeChain, tokenId]);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }

    if (chain) {
      setBridgeChain(chain);
    }
  }, [tokenFromUrl, chain]);

  return bridgeTokenType === "erc20" ? (
    <Erc20BridgeWrapper
      token={token}
      minterInfo={minterInfo}
      bridgeChain={bridgeChain}
      targetTokenBridgeChain={targetTokenBridgeChain}
      onTokenChange={handleTokenChange}
      onBridgeChainChange={handleBridgeChangeChange}
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
      onBridgeChainChange={handleBridgeChangeChange}
    />
  ) : bridgeTokenType === "eth" ? (
    <EthBridgeWrapper
      token={token}
      minterInfo={minterInfo}
      bridgeChain={bridgeChain}
      targetTokenBridgeChain={targetTokenBridgeChain}
      onTokenChange={handleTokenChange}
      onBridgeChainChange={handleBridgeChangeChange}
      bridgeType={bridgeType}
    />
  ) : null;
}
