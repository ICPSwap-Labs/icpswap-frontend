import { useHistory } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import NFTCard from "components/NFT/market/NFTCard";
import { useNFTRecommend } from "hooks/nft/trade";
import NoData from "components/no-data";
import { pageArgsFormat } from "@icpswap/utils";
import { MainCard } from "components/index";
import Loading from "components/Loading/Static";
import { TradeOrder } from "types/nft";
import { Trans } from "@lingui/macro";

const useStyles = makeStyles((theme: Theme) => {
  return {
    collectionContainer: {
      display: "grid",
      gridGap: "18px 20px",
      gridTemplateColumns: "1fr 1fr 1fr",
      width: "fit-content",
      "@media (max-width:470px)": {
        position: "static",
        right: "0",
        gridGap: "18px 20px",
        gridTemplateColumns: "1fr",
      },
      "@media (max-width:680px) and (min-width:470px)": {
        position: "static",
        right: "0",
        gridGap: "18px 20px",
        gridTemplateColumns: "1fr 1fr",
      },
      "@media (min-width:1400px)": {
        position: "static",
        right: "0",
        gridGap: "18px 20px",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        width: "auto",
      },
      "@media (min-width:1600px)": {
        position: "static",
        right: "0",
        gridGap: "23px 30px",
        gridTemplateColumns: "repeat(6, 1fr)",
        width: "auto",
      },
    },
  };
});

export default function NFTRecommend() {
  const classes = useStyles();
  const history = useHistory();
  const [offset] = pageArgsFormat(1, 10);

  const { loading, result } = useNFTRecommend(offset, 10);
  const { content } = result ?? { totalElements: 0, content: [] as TradeOrder[] };

  const handleMoreClick = () => {
    history.push("/marketplace/NFT");
  };

  return (
    <MainCard>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="h3" color="text.primary">
            <Trans>Recommend</Trans>
          </Typography>
        </Grid>
        <Typography sx={{ cursor: "pointer" }} onClick={handleMoreClick}>
          <Trans>More</Trans>
        </Typography>
      </Grid>
      <Box mt="30px" className={classes.collectionContainer}>
        {content.map((order) => (
          <Box key={Number(order.tokenIndex)}>
            <NFTCard order={order} />
          </Box>
        ))}
      </Box>
      {content && content.length === 0 && !loading ? <NoData /> : null}
      <Loading loading={loading} />
    </MainCard>
  );
}
