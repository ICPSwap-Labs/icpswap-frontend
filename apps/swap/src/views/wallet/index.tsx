import { useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { Box } from "@mui/material";
import WalletAccount from "components/Wallet/WalletAccount";
import TokenList from "components/Wallet/TokenList";
import NFTList from "components/Wallet/NFTList";
import WalletContext, { TokenBalance, Page } from "components/Wallet/context";
import { useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/ConnectWallet";

export default function Wallet() {
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [refreshTotalBalance, setRefreshTotalBalance] = useState(false);
  const [totalValue, setTotalValue] = useState<TokenBalance>({} as TokenBalance);
  const [totalUSDBeforeChange, setTotalUSDBeforeChange] = useState<TokenBalance>({} as TokenBalance);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<BigNumber>(new BigNumber(0));
  const [page, setPage] = useState<Page>("token");
  const [noUSDTokens, setNoUSDTokens] = useState<string[]>([]);

  const walletIsConnected = useConnectorStateConnected();

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

  return walletIsConnected ? (
    <WalletContext.Provider
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
        page,
        setPage,
        noUSDTokens,
        setNoUSDTokens: handleSetNoUSDTokens,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "1400px" }}>
          <WalletAccount />
          <Box sx={{ margin: "30px 0 0 0" }}>
            <Box sx={{ display: page === "token" ? "block" : "none" }}>
              <TokenList />
            </Box>
            <Box sx={{ display: page === "nft" ? "block" : "none" }}>
              <NFTList />
            </Box>
          </Box>
        </Box>
      </Box>
    </WalletContext.Provider>
  ) : (
    <ConnectWallet />
  );
}
