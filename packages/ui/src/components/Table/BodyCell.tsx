import { Typography, TypographyProps } from "../Mui";

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
        fontSize: sub ? "14px" : "16px",
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
      className={`${overflow ? "text-overflow-ellipsis" : ""}`}
    >
      {props.children}
    </Typography>
  );
}
