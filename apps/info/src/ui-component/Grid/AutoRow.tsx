import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function GridAutoRows({ gap, children }: { gap: string; children: ReactNode | ReactNode[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridAutoRows: "auto",
        rowGap: gap,
      }}
    >
      {children}
    </Box>
  );
}
