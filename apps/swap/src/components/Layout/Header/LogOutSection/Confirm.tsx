import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function LogoutConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography sx={{ position: "relative" }} component="div">
          <Typography sx={{ fontSize: theme.fontSize.lg, fontWeight: 700 }} component="span" color="textPrimary">
            {t("common.logout")}
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography lineHeight="1.15rem">{t("logout.description")}</Typography>
          </Grid>
          <Grid container item justifyContent="flex-end" spacing={2} alignItems="center">
            <Grid item>
              <Button disableElevation fullWidth type="submit" variant="outlined" color="primary" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
            </Grid>
            <Grid item>
              <Button disableElevation fullWidth type="submit" variant="contained" color="primary" onClick={onConfirm}>
                {t("common.confirm")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
