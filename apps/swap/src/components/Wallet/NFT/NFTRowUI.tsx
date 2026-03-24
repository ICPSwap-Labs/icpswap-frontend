import type { NFTTokenMetadata } from "@icpswap/types";
import { Box, Typography } from "components/Mui";
import NFTAvatar from "components/NFT/NFTAvatar";
import { useWalletNFTStore } from "components/Wallet/NFT/store";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { useCallback } from "react";

interface NFTRowUIProps {
  nft: NFTTokenMetadata;
}

export function NFTRowUI({ nft }: NFTRowUIProps) {
  const { setPages } = useWalletStore();
  const { setDisplayedNFTTokenInfo } = useWalletNFTStore();

  const handleNFTClick = useCallback(() => {
    setDisplayedNFTTokenInfo({ id: nft.cId, index: nft.tokenId });
    setPages(WalletManagerPage.NFTTokenDetails);
  }, [setDisplayedNFTTokenInfo, setPages, nft]);

  return (
    <Box sx={{ maxWidth: "160px" }} onClick={handleNFTClick}>
      <NFTAvatar metadata={nft} />
      <Typography
        sx={{
          color: "text.primary",
          margin: "12px 0 0 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {nft.name}
      </Typography>
      <Typography sx={{ fontSize: "12px", margin: "8px 0 0 0" }}>#{nft.tokenId}</Typography>
    </Box>
  );
}
