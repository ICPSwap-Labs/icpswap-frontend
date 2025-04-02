import { ReactNode } from "react";

import { Box } from "../Mui";

export interface GridRowProps {
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  children: ReactNode;
  margin?: string;
}

export function GridRow({ children, width, align, justify, padding, border, borderRadius, margin }: GridRowProps) {
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

export function GridRowBetween(props: GridRowProps) {
  return (
    <GridRow {...props} justify="space-between">
      {props.children}
    </GridRow>
  );
}

export interface GridRowFixedProps {
  children: ReactNode;
  gap?: string;
  justify?: string;
  align?: string;
}

export function GridRowFixed({ gap, children, align }: GridRowFixedProps) {
  return (
    <GridRow justify="space-between" width="fit-content" margin={gap && `-${gap}`} align={align}>
      {children}
    </GridRow>
  );
}
