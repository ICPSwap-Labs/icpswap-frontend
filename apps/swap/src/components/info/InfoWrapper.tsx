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
        sx={{
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
          padding: "48px 0",
          ...sx,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
