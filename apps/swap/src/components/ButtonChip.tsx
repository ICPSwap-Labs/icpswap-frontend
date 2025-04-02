import { Chip, ButtonBase, useTheme } from "components/Mui";

export interface ButtonChipProps {
  label: string;
  onClick?: () => void;
  border?: "primary";
}

export function ButtonChip({ label, onClick, border }: ButtonChipProps) {
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <ButtonBase sx={{ borderRadius: "12px" }}>
      <Chip
        sx={{
          background: "transparent",
          border: `1px solid ${border === "primary" ? theme.colors.primaryMain : theme.colors.secondaryMain}`,
          borderRadius: "12px",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.themeOption.defaultGradient
                : `${theme.colors.lightPrimaryMain}!important`,
          },
          lineHeight: 0,
          "& .MuiChip-label": {
            color: "#ffffff",
            overflow: "visible",
            "@media(max-width: 640px)": {
              fontSize: "12px",
            },
          },
        }}
        label={label}
        variant="outlined"
        onClick={handleClick}
      />
    </ButtonBase>
  );
}
