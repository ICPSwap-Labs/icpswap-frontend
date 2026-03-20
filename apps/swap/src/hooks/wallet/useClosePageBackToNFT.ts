import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { AssetsType, useWalletTokenContext } from "components/Wallet/token/context";
import { useCallback } from "react";

export function useClosePageBackToNFT() {
  const { setPages } = useWalletContext();
  const { setSelectedContact } = useWalletAddressBookContext();
  const { setActiveAssetsTab } = useWalletTokenContext();

  return useCallback(() => {
    setPages(WalletManagerPage.Index);

    // Set the active tab to NFT
    setActiveAssetsTab(AssetsType.NFTS);

    // Reset the selected contact if in NFTSend page
    setSelectedContact(undefined);
  }, [setPages, setSelectedContact, setActiveAssetsTab]);
}
