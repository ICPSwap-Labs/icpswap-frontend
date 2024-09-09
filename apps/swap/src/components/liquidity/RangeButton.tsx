import { Box, Typography, useTheme } from "components/Mui";

export interface RangeButtonProps {
  text: string;
  value: string;
  onClick: (value: string) => void;
  active?: string | null;
}

export function RangeButton({ text, active, value, onClick }: RangeButtonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "fit-content",
        background: theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
        padding: "8px 12px",
        cursor: "pointer",
        "&.active, &:hover": {
          border: `1px solid #8492C4`,
          background: theme.palette.background.level4,
          "& .MuiTypography-root": {
            color: "text.primary",
          },
        },
      }}
      className={`${active === value ? "active" : ""}`}
      onClick={() => onClick(value)}
    >
      <Typography sx={{ fontWeight: 500 }}>{text}</Typography>
    </Box>
  );
}
