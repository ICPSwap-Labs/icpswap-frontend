import { useParsedQueryString } from "@icpswap/hooks";
import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { ckBTC, ckUSDC, ckETH, ckDoge } from "@icpswap/tokens";
import { Erc20BridgeWrapper, BtcBridgeWrapper, EthBridgeWrapper, DogeBridgeWrapper } from "components/ck-bridge";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToken } from "hooks/useCurrency";
import { useNavigate } from "react-router-dom";
import { useGlobalMinterInfoManager } from "store/global/hooks";

export default function CkBridge() {
  const [token, setToken] = useState<Token>(ckUSDC);
  const [bridgeChain, setBridgeChain] = useState<BridgeChainType>(BridgeChainType.erc20);

  const navigate = useNavigate();

  const { chainType, tokenId } = useParsedQueryString() as {
    chainType: BridgeChainType | undefined;
    tokenId: string | undefined;
  };

  const [, tokenFromUrl] = useToken(tokenId);

  const [minterInfo] = useGlobalMinterInfoManager();

  const bridgeTokenType = useMemo(() => {
    if (!token || !minterInfo) return;

    const erc20TokenMinterInfo = minterInfo.supported_ckerc20_tokens[0]?.find(
      (e) => e.ledger_canister_id.toString() === token.address,
    );

    if (nonUndefinedOrNull(erc20TokenMinterInfo)) return BridgeChainType.erc20;

    switch (token.address) {
      case ckETH.address:
        return BridgeChainType.eth;
      case ckBTC.address:
        return BridgeChainType.btc;
      case ckDoge.address:
        return BridgeChainType.doge;
      default:
        return nonUndefinedOrNull(erc20TokenMinterInfo) ? BridgeChainType.erc20 : BridgeChainType.btc;
    }
  }, [token, minterInfo]);

  const bridgeType = useMemo(() => {
    return bridgeChain === BridgeChainType.icp ? BridgeType.dissolve : BridgeType.mint;
  }, [token, bridgeChain]);

  const targetTokenBridgeChain = useMemo(() => {
    if (bridgeChain === BridgeChainType.icp) {
      switch (token.address) {
        case ckETH.address:
          return BridgeChainType.eth;
        case ckBTC.address:
          return BridgeChainType.btc;
        case ckDoge.address:
          return BridgeChainType.doge;
        default:
          return BridgeChainType.erc20;
      }
    }

    return BridgeChainType.icp;
  }, [token, bridgeChain]);

  const handleTokenChange = useCallback(
    (token: Token, chain: BridgeChainType) => {
      navigate(`/ck-bridge?tokenId=${token.address}&chainType=${chain}`);
    },
    [navigate],
  );

  const handleBridgeChangeChange = useCallback(() => {
    navigate(`/ck-bridge?tokenId=${tokenId ?? ckUSDC.address}&chainType=${targetTokenBridgeChain}`);
  }, [targetTokenBridgeChain, tokenId]);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }

    if (chainType) {
      setBridgeChain(chainType);
    }
  }, [tokenFromUrl, chainType]);

  switch (bridgeTokenType) {
    case BridgeChainType.erc20:
      return (
        <Erc20BridgeWrapper
          token={token}
          minterInfo={minterInfo}
          bridgeChain={bridgeChain}
          targetTokenBridgeChain={targetTokenBridgeChain}
          onTokenChange={handleTokenChange}
          onBridgeChainChange={handleBridgeChangeChange}
          bridgeType={bridgeType}
        />
      );

    case BridgeChainType.btc:
      return (
        <BtcBridgeWrapper
          token={token}
          minterInfo={minterInfo}
          bridgeChain={bridgeChain}
          targetTokenBridgeChain={targetTokenBridgeChain}
          onTokenChange={handleTokenChange}
          bridgeType={bridgeType}
          onBridgeChainChange={handleBridgeChangeChange}
        />
      );

    case BridgeChainType.eth:
      return (
        <EthBridgeWrapper
          token={token}
          minterInfo={minterInfo}
          bridgeChain={bridgeChain}
          targetTokenBridgeChain={targetTokenBridgeChain}
          onTokenChange={handleTokenChange}
          onBridgeChainChange={handleBridgeChangeChange}
          bridgeType={bridgeType}
        />
      );

    case BridgeChainType.doge:
      return (
        <DogeBridgeWrapper
          token={token}
          minterInfo={minterInfo}
          bridgeChain={bridgeChain}
          targetTokenBridgeChain={targetTokenBridgeChain}
          onTokenChange={handleTokenChange}
          bridgeType={bridgeType}
          onBridgeChainChange={handleBridgeChangeChange}
        />
      );

    default:
      return null;
  }
}
