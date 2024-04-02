import { MainCard } from "components/index";
import { Grid, Typography, Box, Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { type EXTCollection, type ExtNft } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { decodeTokenId } from "utils/nft/index";
import { extNFTImage } from "utils/nft/ext";
import { useState } from "react";
import { NFTAvatar } from "./NFTAvatar";
import { NFTTransfer } from "./Transfer";

export interface NFTCardProps {
  nft: ExtNft;
  collection: EXTCollection | undefined;
  setReload?: () => void;
}

export function NFTCard({ nft, collection, setReload }: NFTCardProps) {
  const theme = useTheme() as Theme;
  const { index } = decodeTokenId(nft.id);
  const nftImage = extNFTImage(nft.canister, index ?? 0, nft.id, false);

  const [transferOpen, setTransferOpen] = useState(false);

  const handleTransfer = () => {
    setTransferOpen(true);
  };

  const handleTransferSuccess = () => {
    if (setReload) setReload();
  };

  return (
    <MainCard
      level={5}
      sx={{
        position: "relative",
        padding: "12px",
        cursor: "pointer",
      }}
    >
      <Grid sx={{ position: "relative", background: theme.palette.background.level2, borderRadius: "8px" }}>
        <Grid container justifyContent="center">
          <NFTAvatar image={nftImage} />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography
          variant="h4"
          color="textPrimary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {collection?.name}
        </Typography>

        <Box mt={1}>
          <Grid container>
            <Grid item xs>
              <Typography>#{index ? index + 1 : "--"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="medium" onClick={handleTransfer}>
            Transfer
          </Button>
        </Box>
      </Box>

      {transferOpen ? (
        <NFTTransfer
          nft={nft}
          image={nftImage}
          open={transferOpen}
          index={index}
          onTransferSuccess={handleTransferSuccess}
          onClose={() => setTransferOpen(false)}
          collection={collection}
        />
      ) : null}
    </MainCard>
  );
}
