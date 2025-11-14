import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useCallback } from "react";
import { Box } from "components/Mui";
import { LoadingRow, NoData } from "components/index";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccount } from "store/auth/hooks";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCanisterNFTs } from "hooks/nft/useNFTCalls";
import { isUndefinedOrNull } from "@icpswap/utils";
import { NFTRowUI } from "components/Wallet/NFT/NFTRowUI";

export function NFTCanister() {
  const { setPages } = useWalletContext();
  const { displayedNFTInfo } = useWalletNFTContext();
  const account = useAccount();
  const [page, setPage] = useState<number>(1);

  const { hasMore, loading, nfts } = useCanisterNFTs(displayedNFTInfo?.id, account, page);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

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
        <InfiniteScroll
          dataLength={nfts?.length ?? 0}
          next={handleScrollNext}
          hasMore={hasMore}
          loader={
            <Box sx={{ padding: "12px" }}>
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            </Box>
          }
        >
          {loading ? (
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
                <NFTRowUI key={nft.tokenId} nft={nft} />
              ))}
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </DrawerWrapper>
  ) : null;
}
