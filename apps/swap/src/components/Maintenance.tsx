import { Grid, Box, Typography } from "@mui/material";
import MaintenanceSVG from "assets/images/Maintenance.svg";
import { Trans } from "@lingui/macro";
import TextButton from "./TextButton";

export function Maintenance() {
  return (
    <Box sx={{ width: "100%", margin: "80px 0 0 0" }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
            <Typography color="text.primary" align="center" sx={{ fontSize: "24px", margin: "0 0 20px 0" }}>
              <Trans>🚧 Page Under Maintenance 🚧</Trans>
            </Typography>
            <img src={MaintenanceSVG} alt="" />
            <Box
              sx={{
                width: "374px",
                background: "rgba(17, 25, 54, 0.2)",
                borderRadius: "8px",
                padding: "24px",
              }}
            >
              <Box sx={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "10px 0" }}>
                <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                  We are currently upgrading this page to enhance your experience.
                </Typography>
                <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                  Thank you for your patience! Stay updated by following&nbsp;
                  <TextButton sx={{ fontSize: "12px" }} link="https://twitter.com/ICPSwap">
                    ICPSwap on Twitter.
                  </TextButton>
                </Typography>
                <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                  We appreciate your support and look forward to welcoming you back soon.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
