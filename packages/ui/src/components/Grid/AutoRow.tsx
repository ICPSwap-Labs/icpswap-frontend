import { Box } from "@mui/material";
import { ReactNode } from "react";

export interface GridAutoRowsProps {
  gap: string;
  children: ReactNode | ReactNode[];
}

export function GridAutoRows({ gap, children }: GridAutoRowsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridAutoRows: "auto",
        rowGap: gap,
        height: "fit-content",
      }}
    >
      {children}
    </Box>
  );
}
