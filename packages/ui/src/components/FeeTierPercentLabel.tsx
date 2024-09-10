import { BigNumber, nonNullArgs } from "@icpswap/utils";

import { Typography, Box, useTheme } from "./Mui";

export interface FeeTierLabelProps {
  feeTier: bigint | number | string | null | undefined;
}

export function FeeTierPercentLabel({ feeTier }: FeeTierLabelProps) {
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.level4, borderRadius: "8px", padding: "6px 8px" }}>
      <Typography color="text.primary" sx={{ fontSize: "12px" }}>
        {nonNullArgs(feeTier) ? `${new BigNumber(feeTier.toString()).dividedBy(10000).toString()}%` : "--"}
      </Typography>
    </Box>
  );
}
