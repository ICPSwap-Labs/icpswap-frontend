import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Box, Button, Typography, makeStyles } from "components/Mui";
import CollectionBg from "assets/images/nft/collection_bg.jpg";

const useStyles = makeStyles(() => {
  return {
    container: {
      position: "absolute",
      left: "0",
      top: "50%",
      width: "100%",
      overflow: "hidden",
      zIndex: 2,
      transform: "translate(0, -50%)",
    },

    viewAll: {
      marginTop: "40px",
      width: "190px",
      height: "48px",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };
});

export default function MarketCarousel() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  const handleLoadCollections = () => {
    history.push(`/marketplace/collections`);
  };

  return (
    <Box mt="30px" sx={{ width: "100%", height: "320px", position: "relative" }}>
      <Box className={classes.container}>
        <Typography color="text.primary" fontSize="22px" fontWeight="500">
          {t("nft.icpswap.marketplace.create.description")}
        </Typography>

        <Typography color="text.primary" fontSize="42px" fontWeight="700" sx={{ marginTop: "16px" }}>
          {t("nft.icpswap.marketplace")}
        </Typography>

        <Button variant="contained" className={classes.viewAll} onClick={handleLoadCollections}>
          {t("common.view.all")}
        </Button>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "470px", height: "320px", position: "absolute", right: "0", top: "0" }}>
        <img width="100%" height="100%" src={CollectionBg} alt="" />
      </Box>
    </Box>
  );
}
