import { BoxProps, Typography, TypographyProps, Box, useTheme } from "./Mui";

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
}

export function APRPanel({ value, fontWeight = 500, fontSize = "14px", align, wrapperSx, sx }: APRPanelProps) {
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
    </Box>
  );
}
