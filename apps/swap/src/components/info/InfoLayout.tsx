import { ReactNode } from "react";
import { Box } from "components/Mui";

import { InfoNavBar } from "./InfoNavBar";

export function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <InfoNavBar />

      <Box>{children}</Box>
    </>
  );
}
