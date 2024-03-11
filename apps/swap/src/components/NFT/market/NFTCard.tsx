import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Button, Box } from "@mui/material";
import { useTheme, makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { TradeOrder } from "types";
import { Theme } from "@mui/material/styles";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import WICPCurrencyImage from "assets/images/wicp_currency.svg";
import { parseTokenAmount } from "@icpswap/utils";
import { useAccount } from "store/global/hooks";
import NFTBuyReview from "components/NFT/market/NFTBuyReview";
import VerifyNFT from "components/NFT/VerifyNFT";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import NFTAvatar from "components/NFT/NFTAvatar";

export const BorderColor = "#2F3C6D";

const useStyles = makeStyles((theme: Theme) => {
  return {
    imgBox: {
      width: "100%",
      height: 0,
      paddingTop: "100%",
      overflow: "hidden",
      "& img": {
        width: "auto",
        height: "auto",
        maxHeight: "100%",
        maxWidth: "100%",
      },
    },
    logo: {
      "& img": {
        width: "40px",
        height: "40px",
      },
      marginTop: "-20px",
    },
    description: {
      height: "40px",
      marginTop: "10px",
      lineHeight: "20px",
      ...theme.mixins.overflowEllipsis2,
      "-webkit-line-clamp": 2,
    },
  };
});

export default function NFTCard({ order }: { order: TradeOrder }) {
  const classes = useStyles();
  const history = useHistory();
  const account = useAccount();
  const theme = useTheme() as Theme;

  const [reviewShow, setReviewShow] = useState(false);

  const handleCardClick = () => {
    history.push(`/marketplace/NFT/view/${order.nftCid}/${String(order.tokenIndex)}`);
  };

  const isDark = theme.customization.mode === "dark";

  const handleTradeSuccess = () => {
    setReviewShow(false);
    history.push(`/marketplace/NFT/view/${order.nftCid}/${String(order.tokenIndex)}`);
  };

  const isOwner = order?.seller === account;

  const NFTMetadata = useNFTMetadata(order.nftCid, order.tokenIndex);

  return (
    <>
      <Box
        sx={{
          borderRadius: "12px",
          cursor: "pointer",
          background: isDark ? "#273051" : "#f5f5f5",
        }}
      >
        <Box className={classes.imgBox} onClick={handleCardClick}>
          <Box sx={{ padding: "12px", marginTop: "-100%" }}>
            <Box sx={{ background: theme.palette.background.level3, borderRadius: "8px" }}>
              <NFTAvatar metadata={NFTMetadata} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ padding: "0 12px 24px 12px" }}>
          <Typography
            color="text.primary"
            fontWeight="600"
            sx={{
              ...theme.mixins.overflowEllipsis,
            }}
          >
            {order?.name}
          </Typography>

          <Box mt="16px">
            <Grid container alignItems="center">
              <Typography>#{Number(order?.tokenIndex)}</Typography>

              <Grid item xs>
                <VerifyNFT minter={order.minter} justifyContent="flex-end" />
              </Grid>
            </Grid>
          </Box>

          <Box
            mt="14px"
            mb="20px"
            sx={{
              height: "0.5px",
              background: BorderColor,
            }}
          />

          <Grid container alignItems="center">
            <Grid item xs>
              <Grid container alignItems="center" onClick={handleCardClick}>
                <Grid item>
                  <Grid container alignItems="center">
                    <img width="14px" height="14px" src={WICPCurrencyImage} alt="" />
                    <Grid item ml="3px">
                      <Typography color="text.primary" fontWeight="700" fontSize="14px" component="span">
                        {parseTokenAmount(order?.price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item xs ml="5px">
                  <Typography fontSize="12px">({formatDollarAmount(USDValue?.toNumber())})</Typography>
                </Grid> */}
              </Grid>
            </Grid>

            {!isOwner && (
              <Button
                variant="contained"
                onClick={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();
                  setReviewShow(true);
                }}
                sx={{
                  height: "28px",
                  borderRadius: "4px",
                }}
              >
                <Trans>Buy</Trans>
              </Button>
            )}
          </Grid>
        </Box>
      </Box>
      <NFTBuyReview
        open={reviewShow}
        onClose={() => setReviewShow(false)}
        order={order}
        onTradeSuccess={handleTradeSuccess}
      />
    </>
  );
}
