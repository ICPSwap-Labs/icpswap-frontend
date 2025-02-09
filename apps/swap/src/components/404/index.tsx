import { Grid, Box, Typography } from "components/Mui";
import { ReactComponent as BoundaryErrorImage } from "assets/images/boundary-error.svg";
import { useTranslation } from "react-i18next";

export default function PageNotFound() {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 280px)" }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
        <Grid item>
          <BoundaryErrorImage />
          <Typography color="text.primary" align="center" sx={{ marginTop: "20px" }}>
            {t("common.page.not.found")}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
