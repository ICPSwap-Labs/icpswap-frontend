import { ReactNode } from "react";
import { BoxProps, Typography, TypographyProps, Box, useTheme } from "./Mui";
import { Tooltip } from "./Tooltip";

export interface APRProps {
  value: string | undefined | null;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  fontSize?: string;
  fontWeight?: number;
}

export function APR({ value, fontWeight, fontSize, ...props }: APRProps) {
  return (
    <Typography
      color="text.apr"
      sx={{
        fontWeight: fontWeight ?? 400,
        display: "flex",
        alignItems: "center",
        justifyContent: props.align === "right" ? "flex-end" : "flex-start",
        fontSize: fontSize ?? "inherit",
      }}
    >
      {value}
    </Typography>
  );
}

export interface APRPanelProps {
  value: string | undefined | null;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  fontSize?: string;
  fontWeight?: number;
  wrapperSx?: BoxProps["sx"];
  sx?: TypographyProps["sx"];
  tooltip?: ReactNode;
}

export function APRPanel({ value, fontWeight = 500, fontSize = "14px", align, tooltip, wrapperSx, sx }: APRPanelProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "fit-content",
        padding: "6px 5px",
        borderRadius: "8px",
        background: theme.colors.apr,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        ...wrapperSx,
      }}
    >
      {tooltip ? (
        <Tooltip tips={tooltip}>
          <Typography
            color="text.apr"
            sx={{
              fontWeight,
              fontSize,
              color: theme.colors.darkLevel1,
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              ...sx,
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          color="text.apr"
          sx={{
            fontWeight,
            fontSize,
            color: theme.colors.darkLevel1,
            ...sx,
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}
