import { ReactNode } from "react";

import { Box } from "../Mui";

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
