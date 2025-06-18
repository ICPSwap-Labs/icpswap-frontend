import { MainCard } from "components/index";
import { Grid, Typography, Box, makeStyles, useTheme, Theme } from "components/Mui";
import { isDarkTheme } from "utils";
import { useNFTOrderInfo } from "hooks/nft/trade";
import { useNFTByMetadata } from "hooks/nft/useNFTMetadata";
import type { NFTTokenMetadata } from "@icpswap/types";
import NFTAvatar from "components/NFT/NFTAvatar";

import WICPPriceFormat from "./WICPPriceFormat";
import OnSaleLabel from "./OnSaleLabel";

const useStyles = makeStyles((theme: Theme) => {
  const isDark = isDarkTheme(theme);

  return {
    desc: {
      ...(isDark ? { color: theme.colors.darkTextTertiary } : {}),
      lineHeight: "20px",
      fontSize: "12px",
      wordBreak: "break-all",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": 2,
    },
    positionSVG: {
      "& svg": {
        width: "100%",
        height: "auto",
      },
    },
  };
});

export interface NFTCardProps {
  canisterId: string;
  nft: NFTTokenMetadata;
  onCardClick: (nft: NFTTokenMetadata) => void;
  showDetails?: boolean;
}

export default function NFTCard({ nft, onCardClick, showDetails = true }: NFTCardProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const isDarkTheme = theme.customization.mode === "dark";

  const metadata = useNFTByMetadata(nft);
  const { result: _order } = useNFTOrderInfo(nft.cId, nft.tokenId);

  const isOnSale = !!_order;

  return (
    <MainCard
      level={5}
      sx={{
        position: "relative",
        padding: "12px",
        cursor: "pointer",
        ...(isDarkTheme ? {} : { background: "#f5f5f5" }),
      }}
      onClick={() => onCardClick(nft)}
    >
      <Grid sx={{ position: "relative", background: theme.palette.background.level2, borderRadius: "8px" }}>
        <Grid container justifyContent="center">
          <NFTAvatar metadata={metadata} />
        </Grid>

        {isOnSale ? (
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "70px",
              height: "28px",
            }}
          >
            <OnSaleLabel />
          </Box>
        ) : null}
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
          {nft.name}
        </Typography>
        <Box mt={1}>
          <Grid container>
            <Grid item xs>
              <Typography>#{Number(nft.tokenId)}</Typography>
            </Grid>
            {isOnSale ? (
              <Grid item>
                <WICPPriceFormat price={_order?.price} fontSize="16px" />
              </Grid>
            ) : null}
          </Grid>
        </Box>
        {showDetails ? (
          <Grid mt={2} container flexDirection="column">
            <Grid mt={1} sx={{ height: "40px" }}>
              <Typography className={classes.desc}>{nft.introduction}</Typography>
            </Grid>
          </Grid>
        ) : null}
      </Box>
    </MainCard>
  );
}
