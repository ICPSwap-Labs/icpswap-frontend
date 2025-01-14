import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "components/Mui";
import NFTCard from "components/NFT/NFTCard";
import { useCanisterNFTList } from "hooks/nft/useNFTCalls";
import { useAccount } from "store/global/hooks";
import { pageArgsFormat } from "@icpswap/utils";
import { NoData, ImageLoading } from "@icpswap/ui";
import Pagination from "components/pagination";
import type { NFTTokenMetadata } from "@icpswap/types";

export default function NFTList({ canisterId }: { canisterId: string }) {
  const history = useHistory();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 24 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const account = useAccount();

  const { result, loading } = useCanisterNFTList(canisterId, account, offset, pagination.pageSize);
  const { content: NFTList, totalElements } = result ?? { content: [] as NFTTokenMetadata[], totalElements: 0 };

  const handlePageChange = useCallback(
    (pagination) => {
      setPagination(pagination);
    },
    [setPagination],
  );

  const handleCardClick = useCallback(
    (nft: NFTTokenMetadata) => {
      history.push(`/wallet/nft/view/${canisterId}/${nft.tokenId}`);
    },
    [history],
  );

  return (
    <Box sx={{ position: "relative", minHeight: "300px" }}>
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridGap: "10px 20px",
          gridTemplateColumns: "1fr 1fr 1fr",
          width: "fit-content",
          "@media (max-width:479px)": {
            position: "static",
            right: "0",
            gridGap: "20px 10px",
            gridTemplateColumns: "1fr",
            width: "auto",
          },
          "@media (min-width:480px) and (max-width:719px)": {
            position: "static",
            right: "0",
            gridGap: "20px 10px",
            gridTemplateColumns: "1fr 1fr",
            width: "auto",
          },
          "@media (min-width:720px) and (max-width:960px)": {
            position: "static",
            right: "0",
            gridGap: "20px 10px",
            gridTemplateColumns: "1fr 1fr 1fr",
            width: "auto",
          },
          "@media (min-width:961px) and (max-width:1240px)": {
            position: "static",
            right: "0",
            gridGap: "20px 10px",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            width: "auto",
          },
          "@media (min-width:1241px) ": {
            position: "static",
            right: "0",
            gridGap: "20px 10px",
            gridTemplateColumns: "repeat(6, 1fr)",
            width: "auto",
          },
        }}
      >
        {NFTList.map((nft) => (
          <NFTCard
            key={Number(nft.tokenId)}
            canisterId={canisterId}
            nft={nft}
            onCardClick={handleCardClick}
            showDetails={false}
          />
        ))}
      </Box>

      {NFTList && !loading && NFTList.length === 0 ? <NoData /> : null}

      {totalElements && Number(totalElements) !== 0 ? (
        <Box mt="12px">
          <Pagination
            count={Number(totalElements)}
            defaultPageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </Box>
      ) : null}

      {loading ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <ImageLoading loading={loading} mask />
        </Box>
      ) : null}
    </Box>
  );
}
