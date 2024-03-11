import { ReactNode } from "react";
import { Typography, TypographyProps } from "@mui/material";

export interface LabelProps extends TypographyProps {
  end?: boolean;
  children: ReactNode | ReactNode[];
  sx?: { [key: string]: any };
}

export const Label = ({ end, color, children, sx }: LabelProps) => (
  <Typography
    sx={{
      color: color ? "text.secondary" : color,
      display: "flex",
      fontWeight: 400,
      justifyContent: end ? "flex-end" : "flex-start",
      alignItems: "center",
      fontVariantNumeric: "tabular-nums",
      "@media screen and (max-width: 640px)": {
        fontSize: "14px",
      },

      ...(sx ?? {}),
    }}
  >
    {children}
  </Typography>
);

export const ClickableText = (props: LabelProps) => {
  return (
    <Label
      sx={{
        textAlign: "end",
        "&:hover": {
          cursor: "pointer",
          opacity: 0.6,
        },
        userSelect: "none",
      }}
    >
      {props.children}
    </Label>
  );
};
