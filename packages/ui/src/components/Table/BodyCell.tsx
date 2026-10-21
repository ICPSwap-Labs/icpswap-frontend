import { Typography, type TypographyProps } from "../Mui";

export type BodyCellProps = {
  color?: string;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  onClick?: (event: any) => void;
  children: React.ReactNode;
  sub?: boolean;
  sx?: TypographyProps["sx"];
  title?: string;
  overflow?: "ellipsis";
  width?: string;
};

export default function BodyCell({ width, sub, sx, align, title, overflow, ...props }: BodyCellProps) {
  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      sx={{
        display: overflow ? "block" : "flex",
        justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
        cursor: "pointer",
        userSelect: "none",
        fontSize: sub ? "13px" : "14px",
        lineHeight: 1.5,
        fontWeight: sub ? 400 : 500,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.015em",
        "@media screen and (max-width: 600px)": {
          fontSize: sub ? "12px" : "14px",
        },
        maxWidth: width,
        ...sx,
      }}
      color={props.color ?? (sub ? "text.secondary" : "text.primary")}
      onClick={handleClick}
      component="div"
      title={title}
      className={`tabular-nums ${overflow ? "text-overflow-ellipsis" : ""}`}
    >
      {props.children}
    </Typography>
  );
}
