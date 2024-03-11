import { useHistory } from "react-router";
import { Grid, Typography, ButtonBase, Box } from "@mui/material";
import { useTheme, makeStyles } from "@mui/styles";
import CollectionDemo from "assets/images/nft/collection_demo.svg";
import CollectionLogo from "assets/images/nft/collection_logo.svg";
import { Trans } from "@lingui/macro";
import { TradeOrder } from "types/nft";
import { Theme } from "@mui/material/styles";

export const BorderColor = "#384572";

const useStyles = makeStyles((theme: Theme) => {
  return {
    imgBox: {
      height: "180px",
      overflow: "hidden",
      "& img": {
        width: "100%",
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

export default function MarketNFTCard({
  order,
  onCardClick = () => {},
}: {
  order: TradeOrder;
  onCardClick?: (value: TradeOrder) => void;
}) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme() as Theme;

  const handleCardClick = () => {
    history.push(`/marketplace/NFT/view/${Number(order.tokenIndex)}`);
    onCardClick && onCardClick(order);
  };

  const isDark = theme.customization.mode === "dark";

  return (
    <Box
      sx={{
        borderRadius: "12px",
        cursor: "pointer",
        background: isDark ? "#273051" : "#f5f5f5",
      }}
      onClick={handleCardClick}
    >
      <Box className={classes.imgBox}>
        <img src={CollectionDemo} alt="" />
      </Box>
      <Grid container justifyContent="center" className={classes.logo}>
        <img src={CollectionLogo} alt="" />
      </Grid>
      <Box p="20px">
        <Grid container flexDirection="column" alignItems="center">
          <Typography variant="h4" color="text.primary">
            Marvel
          </Typography>
          <Typography fontSize="12px" className={classes.description}>
            Meme is an experimental protocol mashing up some of the most exciting innovations in DeFi and crypto
            collectibles. Put your $MEME to work by farming exclusive NFT memes. Stake LP tokens for access to our batch
            of legendary cards.
          </Typography>
        </Grid>
        <Box
          mt="20px"
          mb="24px"
          sx={{
            height: "0.5px",
            background: BorderColor,
          }}
        />
        <Grid container>
          <Grid item xs={4}>
            <Box component="span">
              <Typography color="text.primary" fontSize="24px" fontWeight="500" component="span">
                600
              </Typography>
              <Typography color="text.primary" fontSize="10px" component="span" sx={{ marginLeft: "4px" }}>
                WICP
              </Typography>
            </Box>
            <Typography fontSize="12px" sx={{ marginTop: "10px" }}>
              <Trans>Floor Price</Trans>
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              borderRight: `0.5px solid ${BorderColor}`,
              borderLeft: `0.5px solid ${BorderColor}`,
            }}
          >
            <Grid container justifyContent="center">
              <Box component="span">
                <Typography color="text.primary" fontSize="24px" fontWeight="500" component="span">
                  600
                </Typography>
                <Typography color="text.primary" fontSize="10px" component="span" sx={{ marginLeft: "4px" }}>
                  WICP
                </Typography>
              </Box>
              <Typography fontSize="12px" sx={{ marginTop: "10px" }}>
                <Trans>Listings</Trans>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container justifyContent="flex-end">
              <Box component="span">
                <Typography color="text.primary" fontSize="24px" fontWeight="500" component="span">
                  600
                </Typography>
                <Typography color="text.primary" fontSize="10px" component="span" sx={{ marginLeft: "4px" }}>
                  WICP
                </Typography>
              </Box>
              <Typography fontSize="12px" sx={{ marginTop: "10px" }}>
                <Trans>Volume</Trans>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
