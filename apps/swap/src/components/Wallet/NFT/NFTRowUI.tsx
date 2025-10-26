import { useCallback } from "react";
import { Box, Typography } from "components/Mui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import type { NFTTokenMetadata } from "@icpswap/types";
import NFTAvatar from "components/NFT/NFTAvatar";

interface NFTRowUIProps {
  nft: NFTTokenMetadata;
}

export function NFTRowUI({ nft }: NFTRowUIProps) {
  const { setPages } = useWalletContext();
  const { setDisplayedNFTTokenInfo } = useWalletNFTContext();

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
