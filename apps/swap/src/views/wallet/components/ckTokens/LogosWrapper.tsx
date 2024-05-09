import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";

export interface LogosWrapperProps {
  children: React.ReactNode;
}

export function LogosWrapper({ children }: LogosWrapperProps) {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        borderRadius: "12px",
        background: theme.palette.background.level1,
        padding: "32px",
        "@media(max-width: 980px)": {
          padding: "16px",
        },
      }}
    >
      {children}
    </Box>
  );
}
