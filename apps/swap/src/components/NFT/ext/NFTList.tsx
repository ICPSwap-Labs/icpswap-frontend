import { Box } from "@mui/material";
import { NoData, StaticLoading as Loading } from "components/index";
import { EXTCollection, type ExtNft } from "@icpswap/types";
import { NFTCard } from "./NFTCard";

export interface NFTListProps {
  nfts: ExtNft[] | undefined;
  loading: boolean;
  collection: EXTCollection | undefined;
  setReload?: () => void;
}

export default function NFTList({ nfts, collection, loading, setReload }: NFTListProps) {
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
        {nfts?.map((nft) => <NFTCard key={nft.id} nft={nft} collection={collection} setReload={setReload} />)}
      </Box>

      {nfts && !loading && nfts.length === 0 ? <NoData /> : null}

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
          <Loading loading={loading} mask />
        </Box>
      ) : null}
    </Box>
  );
}
