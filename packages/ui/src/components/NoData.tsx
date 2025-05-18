import { ReactNode } from "react";

import { Box, Typography } from "./Mui";

export interface NoDataProps {
  tip?: ReactNode;
  noTips?: boolean;
  tipColor?: string;
}

export function NoData({ tip, tipColor = "text.secondary", noTips = false }: NoDataProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <img src="/images/empty.svg" alt="" width="90px" height="68px" />

      {noTips === true ? null : tip ? (
        <Typography sx={{ maxWidth: "690px" }} color={tipColor} mt="10px" align="center">
          {tip}
        </Typography>
      ) : (
        <Typography sx={{ textAlign: "center" }}>No result found</Typography>
      )}
    </Box>
  );
}
