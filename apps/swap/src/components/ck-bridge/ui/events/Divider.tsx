import { Box, useTheme } from "components/Mui";

export function Divider() {
  const theme = useTheme();

  return <Box sx={{ background: theme.palette.background.level4, width: "1px", height: "12px" }} />;
}
