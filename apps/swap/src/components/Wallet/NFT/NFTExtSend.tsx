import { useState, useCallback, useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { MessageTypes, useTips } from "hooks/index";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { ResultStatus } from "@icpswap/types";
import { getLocaleMessage } from "i18n/service";
import { NFTSendUI } from "components/Wallet/NFT/NFTSendUI";
import { extNFTTransfer } from "hooks/nft/useExtNFTTransfer";
import { decodeTokenId } from "utils";

export function NFTExtSend() {
  const { t } = useTranslation();
  const { setPages } = useWalletContext();
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const { setSelectedContact } = useWalletAddressBookContext();
  const { extNFTSendingInfo } = useWalletNFTContext();
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
    [setSelectedContact, setLoading, principal, setPages],
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
