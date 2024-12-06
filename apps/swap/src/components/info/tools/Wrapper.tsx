import { ReactNode } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { MainCard } from "@icpswap/ui";

interface ToolsWrapperProps {
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export function ToolsWrapper({ title, action, children }: ToolsWrapperProps) {
  const theme = useTheme();

  return (
    <MainCard sx={{ padding: "0px" }}>
      {title ? (
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            padding: "24px",
            borderBottom: `1px solid ${theme.palette.background.level1}`,
          }}
        >
          {title}
        </Typography>
      ) : null}

      <Box sx={{ padding: "20px 24px", borderBottom: `1px solid ${theme.palette.background.level1}` }}>{action}</Box>

      {children}
    </MainCard>
  );
}