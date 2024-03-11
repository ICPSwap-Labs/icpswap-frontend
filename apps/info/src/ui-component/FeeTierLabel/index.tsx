import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { feeAmountToPercentage } from "utils/swap/index";

export interface FeeTierLabelProps {
  feeTier: bigint | number | string | undefined | null;
}

export default function FeeTierLabel({ feeTier }: FeeTierLabelProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ background: theme.palette.background.level4, borderRadius: "8px", padding: "4px 6px" }}>
      <Typography color="text.primary" sx={{ fontSize: "12px" }}>
        {feeTier || feeTier === 0 ? feeAmountToPercentage(String(feeTier)) : "--"}
      </Typography>
    </Box>
  );
}
