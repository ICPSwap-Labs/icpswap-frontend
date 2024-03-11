import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Wrapper } from "ui-component/index";

export default function MainCard({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <Box
        sx={{
          "@media (max-width: 640px)": {
            paddingTop: "10px",
          },
        }}
      >
        {children}
      </Box>
    </Wrapper>
  );
}
