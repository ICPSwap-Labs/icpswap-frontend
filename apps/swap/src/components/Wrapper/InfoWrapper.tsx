import { Flex } from "@icpswap/ui";
import { Box, type BoxProps } from "components/Mui";
import type { ReactNode } from "react";

export interface InfoWrapperProps {
  children: ReactNode;
  sx?: BoxProps["sx"];
  size?: "small";
}

export function InfoWrapper({ children, size, sx }: InfoWrapperProps) {
  return (
    <Flex fullWidth justify="center">
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
          padding: size === "small" ? "8px 0" : "20px 0",
          "@media(max-width: 640px)": {
            padding: size === "small" ? "8px" : "20px 10px",
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
