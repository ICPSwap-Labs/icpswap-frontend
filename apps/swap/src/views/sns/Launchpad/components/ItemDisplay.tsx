import { Box, Typography } from "@mui/material";

export interface ItemDisplayProps {
  label: string;
  value: string | number | undefined;
}

export function ItemDisplay({ label, value }: ItemDisplayProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography color="text.primary" sx={{ minWidth: "120px" }}>
        {label}
      </Typography>
      <Typography color="text.primary" align="right" sx={{ wordBreak: "break-all" }}>
        {value ?? "--"}
      </Typography>
    </Box>
  );
}
