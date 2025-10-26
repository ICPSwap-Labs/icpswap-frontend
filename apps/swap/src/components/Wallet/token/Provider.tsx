import { useState, useMemo, ReactNode } from "react";
import { BigNumber } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { WalletTokenContext, type TokenBalance, AssetsType } from "components/Wallet/token/context";

interface WalletTokenContextProviderProps {
  children: ReactNode;
}

export function WalletTokenContextProvider({ children }: WalletTokenContextProviderProps) {
  const [refreshTotalBalance, setRefreshTotalBalance] = useState(false);
  const [totalValue, setTotalValue] = useState<TokenBalance>({} as TokenBalance);
  const [totalUSDBeforeChange, setTotalUSDBeforeChange] = useState<TokenBalance>({} as TokenBalance);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<BigNumber>(new BigNumber(0));
  const [noUSDTokens, setNoUSDTokens] = useState<string[]>([]);
  const [tokenReceiveId, setTokenReceiveId] = useState<string | undefined>(undefined);
  const [sendToken, setSendToken] = useState<Token>(ICP);
  const [removeTokenId, setRemoveTokenId] = useState<string | undefined>(undefined);
  const [xtcTopUpShow, setXTCTopUpShow] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  const [activeAssetsTab, setActiveAssetsTab] = useState<AssetsType>(AssetsType.Token);
  const [displayedAssetsTabs, setDisplayedAssetsTabs] = useState<Array<AssetsType>>([AssetsType.Token]);

  const handleTotalValueChange = (tokenId: string, value: BigNumber) => {
    setTotalValue((prevState) => ({ ...prevState, [tokenId]: value }));
  };

  const handleTotalUSDChange = (tokenId: string, value: BigNumber) => {
    setTotalUSDBeforeChange((prevState) => ({ ...prevState, [tokenId]: value }));
  };

  const handleSetNoUSDTokens = (tokenId: string) => {
    setNoUSDTokens((prevState) => [...new Set([...prevState, tokenId])]);
  };

  const allTokenTotalValue = useMemo(() => {
    return Object.values(totalValue).reduce((prev, curr) => prev.plus(curr), new BigNumber(0));
  }, [totalValue]);

  const allTokenTotalUSDChange = useMemo(() => {
    return Object.values(totalUSDBeforeChange).reduce((prev, curr) => prev.plus(curr), new BigNumber(0));
  }, [totalUSDBeforeChange]);

  return (
    <WalletTokenContext.Provider
      value={{
        refreshTotalBalance,
        setRefreshTotalBalance,
        refreshCounter,
        setRefreshCounter,
        allTokenUSDMap: totalValue,
        totalValue: allTokenTotalValue,
        setTotalValue: handleTotalValueChange,
        totalUSDBeforeChange: allTokenTotalUSDChange,
        setTotalUSDBeforeChange: handleTotalUSDChange,
        transferTo,
        setTransferTo,
        transferAmount,
        setTransferAmount,
        noUSDTokens,
        setNoUSDTokens: handleSetNoUSDTokens,
        tokenReceiveId,
        setTokenReceiveId,
        sendToken,
        setSendToken,
        removeTokenId,
        setRemoveTokenId,
        xtcTopUpShow,
        setXTCTopUpShow,
        activeAssetsTab,
        setActiveAssetsTab,
        displayedAssetsTabs,
        setDisplayedAssetsTabs,
      }}
    >
      {children}
    </WalletTokenContext.Provider>
  );
}
