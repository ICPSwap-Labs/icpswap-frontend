import { ReactNode } from "react";
import { Box, BoxProps } from "components/Mui";
import { Flex } from "@icpswap/ui";

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
          ...sx,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
