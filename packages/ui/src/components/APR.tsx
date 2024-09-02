import { Typography } from "./Mui";

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
