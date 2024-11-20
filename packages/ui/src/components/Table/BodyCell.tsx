import { Typography, TypographyProps } from "../Mui";

export type BodyCellProps = {
  color?: string;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  onClick?: (event: any) => void;
  children: React.ReactNode;
  sub?: boolean;
  sx?: TypographyProps["sx"];
};

export default function BodyCell({ sub, sx, align, ...props }: BodyCellProps) {
  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      sx={{
        display: "flex",
        justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
        cursor: "pointer",
        userSelect: "none",
        fontSize: sub ? "14px" : "16px",
        "@media screen and (max-width: 600px)": {
          fontSize: sub ? "12px" : "14px",
        },
        ...sx,
      }}
      color={props.color ?? (sub ? "text.secondary" : "text.primary")}
      onClick={handleClick}
      component="div"
    >
      {props.children}
    </Typography>
  );
}
