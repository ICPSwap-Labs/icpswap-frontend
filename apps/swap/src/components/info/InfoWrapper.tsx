import { useDesignVersion } from "hooks/useDesignVersion";
import { Flex } from "@icpswap/ui";
import { Box, type BoxProps } from "components/Mui";
import type { ReactNode } from "react";

export interface InfoWrapperProps {
  children: ReactNode;
  sx?: BoxProps["sx"];
}

export function InfoWrapper({ children, sx }: InfoWrapperProps) {
  const { isClassicDesign } = useDesignVersion();

  if (isClassicDesign) {
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
