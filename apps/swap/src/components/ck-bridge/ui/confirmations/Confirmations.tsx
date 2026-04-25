import { Flex } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, numToPercent } from "@icpswap/utils";
import { Box, Typography, useTheme } from "components/Mui";
import { useMemo } from "react";

export function Arrow() {
  return <Typography>Δ</Typography>;
}

interface ConfirmationsUIProps {
  confirmations: number;
  currentConfirmations: number | undefined;
}

export function ConfirmationsUI({ confirmations, currentConfirmations }: ConfirmationsUIProps) {
  const theme = useTheme();

  const width = useMemo(() => {
    if (isUndefinedOrNull(currentConfirmations)) return "0%";

    return !new BigNumber(currentConfirmations).isLessThan(confirmations)
      ? "100%"
      : numToPercent(new BigNumber(currentConfirmations).dividedBy(confirmations).toNumber());
  }, [confirmations, currentConfirmations]);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Box sx={{ width: "40px", height: "4px", borderRadius: "20px", background: theme.palette.background.level4 }}>
        <Box sx={{ width, height: "4px", borderRadius: "20px", background: "#54C081" }} />
      </Box>

      <Flex>
        <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{currentConfirmations ?? 0}</Typography>
        <Typography sx={{ fontSize: "12px" }}>/</Typography>
        <Typography sx={{ fontSize: "12px" }}>{confirmations}</Typography>
      </Flex>
    </Flex>
  );
}
