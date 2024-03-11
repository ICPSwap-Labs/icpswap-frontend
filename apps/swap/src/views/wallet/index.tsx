import { useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { Box } from "@mui/material";
import WalletAccount from "components/Wallet/WalletAccount";
import TokenList from "components/Wallet/TokenList";
import NFTList from "components/Wallet/NFTList";
import MainCard from "components/cards/MainCard";
import WalletContext, { TokenBalance, Page } from "components/Wallet/context";
import { useConnectorStateConnected } from "store/auth/hooks";
import ConnectWallet from "components/ConnectWallet";

export default function Wallet() {
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [refreshTotalBalance, setRefreshTotalBalance] = useState(false);
  const [totalValue, setTotalValue] = useState<TokenBalance>({} as TokenBalance);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<BigNumber>(new BigNumber(0));
  const [page, setPage] = useState<Page>("token");

  const walletIsConnected = useConnectorStateConnected();

  const handleTotalValueChange = (tokenId: string, value: BigNumber) => {
    setTotalValue((prevState) => ({ ...prevState, [tokenId]: value }));
  };

  const allTokenTotalValue = useMemo(() => {
    return Object.values(totalValue).reduce((prev, curr) => prev.plus(curr), new BigNumber(0));
  }, [totalValue]);

  return walletIsConnected ? (
    <WalletContext.Provider
      value={{
        refreshTotalBalance,
        setRefreshTotalBalance,
        refreshCounter,
        setRefreshCounter,
        totalValue: allTokenTotalValue,
        setTotalValue: handleTotalValueChange,
        transferTo,
        setTransferTo,
        transferAmount,
        setTransferAmount,
        page,
        setPage,
      }}
    >
      <WalletAccount />
      <Box sx={{ margin: "24px 0 0 0" }}>
        <MainCard>
          <Box sx={{ display: page === "token" ? "block" : "none" }}>
            <TokenList />
          </Box>
          <Box sx={{ display: page === "nft" ? "block" : "none" }}>
            <NFTList />
          </Box>
        </MainCard>
      </Box>
    </WalletContext.Provider>
  ) : (
    <ConnectWallet />
  );
}
