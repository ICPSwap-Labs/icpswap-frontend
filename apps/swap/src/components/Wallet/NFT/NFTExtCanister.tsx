import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useCallback, useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { LoadingRow, NoData } from "components/index";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import type { EXTCollection, ExtNft } from "@icpswap/types";
import { NFTAvatar } from "components/NFT/ext/NFTAvatar";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useEXTAllCollections, useExtUserNFTs } from "@icpswap/hooks";
import { decodeTokenId } from "utils";
import { extNFTImage } from "utils/nft/ext";

interface NFTRowProps {
  extNFT: EXTCollection | undefined;
  nft: ExtNft;
}

function NFTRow({ nft, extNFT }: NFTRowProps) {
  const { setPages } = useWalletContext();
  const { setDisplayedNFTTokenInfo } = useWalletNFTContext();

  const { index } = decodeTokenId(nft.id);
  const extNFTImg = extNFTImage(nft.canister, index ?? 0, nft.id, false);

  const handleNFTClick = useCallback(() => {
    setDisplayedNFTTokenInfo({ id: nft.id, index });
    setPages(WalletManagerPage.NFTExtTokenDetails);
  }, [setDisplayedNFTTokenInfo, setPages, nft]);

  return (
    <Box sx={{ maxWidth: "160px" }} onClick={handleNFTClick}>
      <NFTAvatar image={extNFTImg ?? ""} />

      <Typography
        sx={{
          color: "text.primary",
          margin: "12px 0 0 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {extNFT?.name}
      </Typography>
      <Typography sx={{ fontSize: "12px", margin: "8px 0 0 0" }}>#{index}</Typography>
    </Box>
  );
}

export function NFTExtCanister() {
  const { setPages } = useWalletContext();
  const { displayedNFTInfo } = useWalletNFTContext();
  const principal = useAccountPrincipalString();

  const { result: userExtNFTs, loading } = useExtUserNFTs(principal);
  const { result: extNFTs } = useEXTAllCollections();

  const extNFT = useMemo(() => {
    if (isUndefinedOrNull(extNFTs) || isUndefinedOrNull(displayedNFTInfo)) return undefined;
    return extNFTs.find((element) => element.id === displayedNFTInfo.id);
  }, [extNFTs, displayedNFTInfo]);

  const nfts = useMemo(() => {
    if (isUndefinedOrNull(userExtNFTs) || isUndefinedOrNull(displayedNFTInfo)) return undefined;
    return userExtNFTs.filter((element) => element.canister === displayedNFTInfo.id);
  }, [userExtNFTs, displayedNFTInfo]);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  return displayedNFTInfo ? (
    <DrawerWrapper
      padding="12px"
      title={displayedNFTInfo.name}
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={handlePrev}
    >
      <Box
        sx={{
          margin: "40px 0 0 0",
        }}
      >
        {loading || isUndefinedOrNull(userExtNFTs) || isUndefinedOrNull(extNFTs) ? (
          <Box sx={{ padding: "12px" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : isUndefinedOrNull(nfts) || nfts.length === 0 ? (
          <NoData tip="No NFTs found" />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 16px", width: "100%" }}>
            {nfts.map((nft) => (
              <NFTRow key={nft.id} extNFT={extNFT} nft={nft} />
            ))}
          </Box>
        )}
      </Box>
    </DrawerWrapper>
  ) : null;
}
