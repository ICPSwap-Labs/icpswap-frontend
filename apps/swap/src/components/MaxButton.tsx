import { Typography, TypographyProps, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function MaxButton(props: TypographyProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Typography
      {...props}
      sx={{
        padding: "1px 3px",
        cursor: "pointer",
        borderRadius: "2px",
        backgroundColor: theme.colors.secondaryMain,
        color: "#ffffff",
        fontSize: "12px",
        lineHeight: "1.15rem",
        ...(props.sx ?? {}),
      }}
    >
      {t("common.max")}
    </Typography>
  );
}
