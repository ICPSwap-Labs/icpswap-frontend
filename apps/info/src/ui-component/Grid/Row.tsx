import { Box } from "@mui/material";
import { ReactNode } from "react";

export interface RowProps {
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  children: ReactNode;
  margin?: string;
}

export function Row({ children, width, align, justify, padding, border, borderRadius, margin }: RowProps) {
  return (
    <Box
      sx={{
        gridAutoRows: "auto",
        display: "flex",
        width: width ?? "100%",
        alignItems: align ?? "center",
        justifyContent: justify ?? "flex-start",
        padding: padding ?? 0,
        border,
        borderRadius,
        margin: margin ?? 0,
      }}
    >
      {children}
    </Box>
  );
}

export function RowBetween({ children }: { children: ReactNode }) {
  return <Row justify="space-between">{children}</Row>;
}

export function RowFixed({
  gap,
  children,
  align,
}: {
  children: ReactNode;
  gap?: string;
  justify?: string;
  align?: string;
}) {
  return (
    <Row justify="space-between" width="fit-content" margin={gap && `-${gap}`} align={align}>
      {children}
    </Row>
  );
}
