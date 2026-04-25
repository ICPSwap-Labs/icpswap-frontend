import { ResultStatus } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useWalletAddressBookStore } from "components/Wallet/address-book/store";
import { NFTSendUI } from "components/Wallet/NFT/NFTSendUI";
import { useWalletNFTStore } from "components/Wallet/NFT/store";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { MessageTypes, useTips } from "hooks/index";
import { extNFTTransfer } from "hooks/nft/useExtNFTTransfer";
import { getLocaleMessage } from "i18n/service";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipalString } from "store/auth/hooks";
import { decodeTokenId } from "utils";

export function NFTExtSend() {
  const { t } = useTranslation();
  const { setPages } = useWalletStore();
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const { setSelectedContact } = useWalletAddressBookStore();
  const { extNFTSendingInfo } = useWalletNFTStore();
  const [loading, setLoading] = useState<boolean>(false);

  const { index } = useMemo(() => {
    if (isUndefinedOrNull(extNFTSendingInfo)) return { index: undefined };

    return decodeTokenId(extNFTSendingInfo.extTokenId);
  }, [extNFTSendingInfo]);

  const handleSend = useCallback(
    async (address: string) => {
      if (isUndefinedOrNull(address) || isUndefinedOrNull(extNFTSendingInfo) || isUndefinedOrNull(principal)) return;

      try {
        setLoading(true);

        const { status, message } = await extNFTTransfer(
          extNFTSendingInfo.canister,
          address,
          principal,
          extNFTSendingInfo.extTokenId,
        );

        if (status === ResultStatus.OK) {
          openTip("NFT sent successfully", MessageTypes.success);
          setSelectedContact(undefined);
          setPages(WalletManagerPage.NFTExtCanister);
        } else {
          openTip(getLocaleMessage(message) ?? t("common.transfer.failed"), MessageTypes.error);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    },
    [setSelectedContact, principal, setPages, extNFTSendingInfo, openTip, t],
  );

  return extNFTSendingInfo ? (
    <NFTSendUI
      loading={loading}
      onSend={handleSend}
      disabled={isUndefinedOrNull(extNFTSendingInfo)}
      name={extNFTSendingInfo.name}
      tokenId={index}
      logo={extNFTSendingInfo.logo}
      isExt
    />
  ) : null;
}
