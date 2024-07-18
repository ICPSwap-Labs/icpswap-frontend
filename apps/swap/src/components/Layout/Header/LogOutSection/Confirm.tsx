import { Button, Dialog, DialogTitle, DialogContent, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

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
  const classes = useStyles();

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography className={classes.titleContainer} component="div">
          <Typography className={classes.title} component="span" color="textPrimary">
            <Trans>Log Out</Trans>
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography lineHeight="1.15rem">
              <Trans>
                When you log out, your account information will be cleared for asset security. Please ensure that you
                have safely backed up your wallet's mnemonic phrase.
              </Trans>
            </Typography>
          </Grid>
          <Grid container item justifyContent="flex-end" spacing={2} alignItems="center">
            <Grid item>
              <Button disableElevation fullWidth type="submit" variant="outlined" color="primary" onClick={onCancel}>
                <Trans>Cancel</Trans>
              </Button>
            </Grid>
            <Grid item>
              <Button disableElevation fullWidth type="submit" variant="contained" color="primary" onClick={onConfirm}>
                <Trans>Confirm</Trans>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
