import { Box } from "components/Mui";
import type { ReactNode } from "react";

import { InfoNavBar } from "./InfoNavBar";

export function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <InfoNavBar />

      <Box>{children}</Box>
    </>
  );
}
