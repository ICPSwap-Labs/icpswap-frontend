import { Box, BoxProps, useTheme } from "./Mui";

export interface LineProps {
  sx?: BoxProps["sx"];
}

export function Line({ sx }: LineProps) {
  const theme = useTheme();

  return <Box sx={{ height: "1px", width: "100%", background: theme.palette.background.level4, ...sx }} />;
}
