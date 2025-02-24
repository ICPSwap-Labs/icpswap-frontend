import { makeStyles, Theme, Button, Grid, Typography, Dialog, DialogTitle, DialogContent } from "components/Mui";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
  titleContainer: {
    position: "relative",
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 700,
  },
  detailItem: {
    marginBottom: "24px",
  },
  value: {
    textAlign: "right",
    wordBreak: "break-all",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translate(0, -50%)",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

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
  const classes = useStyles();

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography className={classes.titleContainer} component="div">
          <Typography className={classes.title} component="span" color="textPrimary">
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
