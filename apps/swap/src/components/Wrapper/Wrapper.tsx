import { ReactNode } from "react";
import { Box, BoxProps } from "components/Mui";
import { Flex } from "@icpswap/ui";

export interface WrapperProps {
  children: ReactNode;
  sx?: BoxProps["sx"];
}

export function Wrapper({ children, sx }: WrapperProps) {
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
