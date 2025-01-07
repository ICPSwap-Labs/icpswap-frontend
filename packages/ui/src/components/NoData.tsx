import { Box, Typography } from "@mui/material";

export interface NoDataProps {
  tip?: string;
}

export function NoData({ tip }: NoDataProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <img src="/images/empty.svg" alt="" />

      {tip ? (
        <Typography sx={{ maxWidth: "690px" }} color="text.primary" mt="10px" align="center">
          {tip}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: "16px", textAlign: "center" }}>No result found</Typography>
      )}
    </Box>
  );
}
