import { Button, Typography, CircularProgress, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function ViewMore({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      size="large"
      sx={{
        "&.MuiButton-outlined.MuiButton-outlinedPrimary": {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.text.secondary,
          height: "42px",
          minWidth: "132px",
        },
      }}
      onClick={onClick}
    >
      {loading ? <CircularProgress size={18} color="inherit" sx={{ margin: "0 4px 0 0" }} /> : null}
      <Typography fontWeight={600}>{t("common.view.more")}</Typography>
    </Button>
  );
}
