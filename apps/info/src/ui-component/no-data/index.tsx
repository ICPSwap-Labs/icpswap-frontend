import { Box, Typography } from "@mui/material";
import NoDataIcon from "assets/images/icons/no-data";

export interface NoDataProps {
  tip?: string;
}

export default function NoData({ tip }: NoDataProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
      <NoDataIcon style={{ fontSize: "6rem" }} />
      {tip ? (
        <Typography sx={{ maxWidth: "690px" }} color="text.primary" mt="10px" align="center">
          {tip}
        </Typography>
      ) : null}
    </Box>
  );
}
