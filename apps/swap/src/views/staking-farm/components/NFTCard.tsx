import { Checkbox, Skeleton, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { usePositionNFTSvg } from "hooks/swap/useNFTSvg";
import { type NFTTokenMetadata } from "@icpswap/types";
import { useSwapPosition } from "@icpswap/hooks";
import { getNFTSwapPoolId, getNFTSwapPositionId } from "utils/index";
import { Trans } from "@lingui/macro";

const useStyle = makeStyles(() => ({
  selectNFTBox: {
    position: "relative",
  },
  nft: {
    width: "160px",
    filter: "grayscale(100%)",
  },
  checked: {
    width: "160px",
    border: "1px solid #5669DC",
    filter: "drop-shadow(0px 0px 4px #5669DC)",
    borderRadius: "22px",
  },
  checkbox: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    "&.noLiquidity": {
      filter: "grayscale(100%)!important",
    },
  },
}));

interface StakingNFTCardProps {
  nft: NFTTokenMetadata;
  selectedNFTId: number | undefined;
  setSelectedNFTId: (NFTId: number) => void;
}

export default function StakingNFTCard({ nft, selectedNFTId, setSelectedNFTId }: StakingNFTCardProps) {
  const classes = useStyle();

  const svg = usePositionNFTSvg(nft.tokenId);

  const { result: position } = useSwapPosition(getNFTSwapPoolId(nft), BigInt(getNFTSwapPositionId(nft)));

  return (
    <Box className={classes.selectNFTBox}>
      {svg ? (
        <>
          <img
            className={`${
              nft.tokenId === selectedNFTId && position?.liquidity !== BigInt(0) ? classes.checked : classes.nft
            }`}
            src={svg}
            alt=""
          />
          {position?.liquidity === BigInt(0) ? (
            <Box
              sx={{
                position: "absolute",
                top: "0",
                padding: "2px 3px",
                right: "0",
                background: "#654DA9",
                borderRadius: "0 8px 0 8px",
              }}
            >
              <Typography color="#fff" fontSize="12px">
                <Trans>Closed</Trans>
              </Typography>
            </Box>
          ) : null}
          <Checkbox
            className={classes.checkbox}
            checked={nft.tokenId === selectedNFTId}
            onChange={() => {
              if (position?.liquidity !== BigInt(0)) {
                setSelectedNFTId(nft.tokenId);
              }
            }}
            name={String(nft.tokenId)}
          />
        </>
      ) : (
        <Skeleton
          sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
          variant="rectangular"
          width={160}
          height={160 / 0.571428}
        />
      )}
    </Box>
  );
}
