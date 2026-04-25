import { useWalletAddressBookStore } from "components/Wallet/address-book/store";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { AssetsType, useWalletTokenStore } from "components/Wallet/token/store";
import { useCallback } from "react";

export function useClosePageBackToNFT() {
  const { setPages } = useWalletStore();
  const { setSelectedContact } = useWalletAddressBookStore();
  const { setActiveAssetsTab } = useWalletTokenStore();

  return useCallback(() => {
    setPages(WalletManagerPage.Index);

    // Set the active tab to NFT
    setActiveAssetsTab(AssetsType.NFTS);

    // Reset the selected contact if in NFTSend page
    setSelectedContact(undefined);
  }, [setPages, setSelectedContact, setActiveAssetsTab]);
}
