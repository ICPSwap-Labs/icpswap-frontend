import { ReactNode } from "react";
import { useTheme, Box } from "components/Mui";

import { InfoNavBar } from "./InfoNavBar";

export function InfoLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <>
      <InfoNavBar />

      <Box>{children}</Box>
    </>
  );
}
