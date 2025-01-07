import { Grid, Box, Typography } from "@mui/material";
import { ReactComponent as BoundaryErrorImage } from "assets/images/boundary-error.svg";
import { Trans } from "@lingui/macro";

export default function PageNotFound() {
  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 280px)" }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
        <Grid item>
          <BoundaryErrorImage />
          <Typography color="text.primary" align="center" sx={{ marginTop: "20px" }}>
            <Trans>Page not found</Trans>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
