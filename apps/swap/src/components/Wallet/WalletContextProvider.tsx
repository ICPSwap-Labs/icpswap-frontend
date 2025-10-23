import { useState, useCallback, useEffect, ReactNode } from "react";
import { WalletManagerPage, WalletContext, Page } from "components/Wallet/context";
import { WalletNFTContextProvider } from "components/Wallet/NFT/NFTAssetsProvider";
import { BalanceConvertProvider } from "components/Wallet/BalanceConvert/BalanceConvertProvider";
import { WalletAddressBookProvider } from "components/Wallet/address-book/Provider";
import { WalletTokenContextProvider } from "components/Wallet/token/Provider";

interface WalletContextProviderProps {
  children: ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<Page>("token");
  const [pages, setPages] = useState<Array<WalletManagerPage>>([]);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

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
        page,
        setPage,
        pages,
        setPages: handleSetPage,
        open,
        setOpen,
        logoutConfirmOpen,
        setLogoutConfirmOpen,
        closeDrawer,
        openDrawer,
      }}
    >
      <WalletTokenContextProvider>
        <WalletAddressBookProvider>
          <BalanceConvertProvider>
            <WalletNFTContextProvider>{children}</WalletNFTContextProvider>
          </BalanceConvertProvider>
        </WalletAddressBookProvider>
      </WalletTokenContextProvider>
    </WalletContext.Provider>
  );
}
