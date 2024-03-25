import { Typography, TypographyProps } from "@mui/material";

export type BodyCellProps = TypographyProps;

export default function BodyCell({ ...props }: BodyCellProps) {
  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      sx={{
        cursor: "pointer",
        userSelect: "none",
        "@media screen and (max-width: 600px)": {
          fontSize: "12px",
        },
        ...props.sx,
      }}
      onClick={handleClick}
      component="div"
    >
      {props.children}
    </Typography>
  );
}
