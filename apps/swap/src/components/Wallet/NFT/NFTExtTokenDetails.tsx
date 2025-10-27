import { useCallback, useMemo } from "react";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";
import { decodeTokenId } from "utils";
import { NFTTokenDetailsUI } from "components/Wallet/NFT/NFTTokenDetailsUI";
import { extNFTImage } from "utils/nft/ext";

export function NFTExtTokenDetails() {
  const { setPages } = useWalletContext();
  const { displayedNFTTokenInfo, setExtNFTSendingInfo } = useWalletNFTContext();
  const principal = useAccountPrincipalString();

  const { result: userExtNFTs, loading } = useExtUserNFTs(principal);
  const { result: extNFTs } = useEXTAllCollections();

  const { metadata, extNFT, index } = useMemo(() => {
    if (isUndefinedOrNull(userExtNFTs) || isUndefinedOrNull(extNFTs) || isUndefinedOrNull(displayedNFTTokenInfo))
      return {};

    const { canister, index } = decodeTokenId(displayedNFTTokenInfo.id);

    const extNFT = extNFTs.find((element) => element.id === canister);
    const metadata = userExtNFTs.find((element) => element.id === displayedNFTTokenInfo.id);

    return { extNFT, metadata, index };
  }, [userExtNFTs, displayedNFTTokenInfo, extNFTs]);

  const logo = useMemo(() => {
    return nonUndefinedOrNull(metadata) ? extNFTImage(metadata.canister, index ?? 0, metadata.id, false) : "";
  }, [metadata, index]);

  const handleNFTSend = useCallback(() => {
    if (isUndefinedOrNull(metadata) || isUndefinedOrNull(extNFT)) return;
    setExtNFTSendingInfo({ name: extNFT.name, extTokenId: metadata.id, canister: extNFT.id, logo });
    setPages(WalletManagerPage.NFTExtSend);
  }, [setPages, metadata, setExtNFTSendingInfo, extNFT, index, logo]);

  return (
    <NFTTokenDetailsUI
      name={extNFT?.name}
      isExt
      loading={isUndefinedOrNull(metadata) || isUndefinedOrNull(extNFT) || loading}
      logo={nonUndefinedOrNull(metadata) ? extNFTImage(metadata.canister, index ?? 0, metadata.id, false) : ""}
      description={extNFT?.description}
      owner={metadata?.owner}
      index={index}
      onSend={handleNFTSend}
    />
  );
}
