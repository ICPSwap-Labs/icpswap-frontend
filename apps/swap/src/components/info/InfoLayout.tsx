import { ReactNode } from "react";
import { useTheme, Box } from "components/Mui";

import { InfoNavBar } from "./InfoNavBar";

export function InfoLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <>
      <InfoNavBar />

      <Box
        sx={{
          padding: "32px 16px 16px",
          [theme.breakpoints.down("md")]: {
            padding: "16px",
            minHeight: "calc(100vh - 60px)",
          },
          [theme.breakpoints.down("sm")]: {
            padding: "12px",
            backgroundColor: "transparent",
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}
