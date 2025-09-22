import { useState, useMemo, useCallback, useEffect, ReactNode } from "react";
import { WalletManagerPage, WalletContext, TokenBalance, Page } from "components/Wallet/context";
import { BigNumber } from "@icpswap/utils";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";

interface WalletContextProviderProps {
  children: ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [refreshTotalBalance, setRefreshTotalBalance] = useState(false);
  const [totalValue, setTotalValue] = useState<TokenBalance>({} as TokenBalance);
  const [totalUSDBeforeChange, setTotalUSDBeforeChange] = useState<TokenBalance>({} as TokenBalance);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<BigNumber>(new BigNumber(0));
  const [page, setPage] = useState<Page>("token");
  const [noUSDTokens, setNoUSDTokens] = useState<string[]>([]);
  const [tokenReceiveId, setTokenReceiveId] = useState<string | undefined>(undefined);
  const [editAddressBook, setEditAddressBook] = useState<AddressBookType | undefined>(undefined);
  const [deleteAddressBook, setDeleteAddressBook] = useState<AddressBookType | undefined>(undefined);
  const [selectedContact, setSelectedContact] = useState<AddressBookType | undefined>(undefined);
  const [sendToken, setSendToken] = useState<Token>(ICP);
  const [pages, setPages] = useState<Array<WalletManagerPage>>([]);
  const [addAddressBookPrevPage, setAddAddressBookPrevPage] = useState<WalletManagerPage>(
    WalletManagerPage.AddressBook,
  );
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [removeTokenId, setRemoveTokenId] = useState<string | undefined>(undefined);
  const [deleteAddressBookLoading, setDeleteAddressBookLoading] = useState<boolean>(false);

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

  const handleSetPage = useCallback(
    (page: WalletManagerPage) => {
      setPages([page]);
    },
    [setPages, pages],
  );

  useEffect(() => {
    handleSetPage(WalletManagerPage.Index);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    handleSetPage(WalletManagerPage.Index);
  }, [setOpen, handleSetPage]);

  const openDrawer = useCallback(() => {
    setOpen(true);
    handleSetPage(WalletManagerPage.Index);
  }, [setOpen, handleSetPage]);

  return (
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
        tokenReceiveId,
        setTokenReceiveId,
        editAddressBook,
        setEditAddressBook,
        deleteAddressBook,
        setDeleteAddressBook,
        selectedContact,
        setSelectedContact,
        sendToken,
        setSendToken,
        pages,
        setPages: handleSetPage,
        addAddressBookPrevPage,
        setAddAddressBookPrevPage,
        open,
        setOpen,
        logoutConfirmOpen,
        setLogoutConfirmOpen,
        closeDrawer,
        openDrawer,
        removeTokenId,
        setRemoveTokenId,
        deleteAddressBookLoading,
        setDeleteAddressBookLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
