import { Typography } from "@mui/material";

export type BodyCellProps = {
  color?: string;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  onClick?: (event: any) => void;
  children: React.ReactNode;
  sub?: boolean;
};

export default function BodyCell({ sub, ...props }: BodyCellProps) {
  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      sx={{
        cursor: "pointer",
        userSelect: "none",
        fontSize: sub ? "14px" : "16px",
        "@media screen and (max-width: 600px)": {
          fontSize: sub ? "12px" : "14px",
        },
      }}
      color={props.color ?? (sub ? "text.secondary" : "text.primary")}
      align={props.align}
      onClick={handleClick}
      component="div"
    >
      {props.children}
    </Typography>
  );
}
