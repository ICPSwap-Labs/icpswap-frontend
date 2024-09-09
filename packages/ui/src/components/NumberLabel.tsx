import { Typography, useTheme } from "./Mui";

export interface NumberLabelProps {
  num: number | string;
}

export function NumberLabel({ num }: NumberLabelProps) {
  const theme = useTheme();

  return (
    <Typography
      fontSize={12}
      fontWeight={500}
      color="text.primary"
      sx={{
        width: "fit-content",
        background: theme.palette.background.level4,
        padding: "2px 8px",
        borderRadius: "44px",
      }}
    >
      {num}
    </Typography>
  );
}
