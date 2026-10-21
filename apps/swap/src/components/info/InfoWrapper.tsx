import { Flex } from "@icpswap/ui";
import { Box, type BoxProps } from "components/Mui";
import type { ReactNode } from "react";

export interface InfoWrapperProps {
  children: ReactNode;
  sx?: BoxProps["sx"];
}

export function InfoWrapper({ children, sx }: InfoWrapperProps) {
  return (
    <Flex fullWidth justify="center">
      <Box
        className="ics-info-content"
        sx={{
          width: "100%",
          maxWidth: "1280px",
          position: "relative",
          padding: "32px 24px 48px",
          "@media(max-width: 640px)": {
            padding: "20px 12px 32px",
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
