import { Box, Grid, Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function OnSaleLabel() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "relative",
        width: "70px",
        height: "28px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: 0,
          background: "rgba(17, 25, 54, 0.5)",
          width: "70px",
          height: "28px",
          borderRadius: "8px",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Typography color="text.primary" fontWeight="600">
            {t("nft.listing")}
          </Typography>
        </Grid>
      </Box>
    </Box>
  );
}
