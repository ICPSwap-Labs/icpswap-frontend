import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";

export default function Maintenance() {
  return (
    <Box sx={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography color="text.primary" sx={{ fontSize: "24px", maxWidth: "720px", padding: "0 20px" }}>
        <Trans>
          This feature is currently under maintenance. Please wait for a while. We apologize for the inconvenience and
          appreciate your patience as we work on improving our product.
        </Trans>
      </Typography>
    </Box>
  );
}
