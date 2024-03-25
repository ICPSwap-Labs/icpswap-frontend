import React from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { closeSnackbar } from "store/snackbar/actions";
import { Alert, Fade, IconButton, SnackbarCloseReason } from "@mui/material";
import MuiSnackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

export default function Snackbar() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const snackbarInitial = useAppSelector((state) => state.snackbar);

  const handleClose = (event: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    dispatch(closeSnackbar());
  };

  const handleClickClose = () => {
    dispatch(closeSnackbar());
  };

  React.useEffect(() => {
    setOpen(snackbarInitial.open);
  }, [snackbarInitial.action, snackbarInitial.open]);

  return (
    <>
      {/* default snackbar */}
      {snackbarInitial.variant === "default" && (
        <MuiSnackbar
          anchorOrigin={snackbarInitial.anchorOrigin}
          open={open}
          autoHideDuration={snackbarInitial.autoHideDuration}
          onClose={handleClose}
          message={snackbarInitial.message}
          TransitionComponent={Fade}
        />
      )}

      {/* alert snackbar */}
      {snackbarInitial.variant === "alert" && (
        <MuiSnackbar
          TransitionComponent={Fade}
          anchorOrigin={snackbarInitial.anchorOrigin}
          open={open}
          autoHideDuration={snackbarInitial.autoHideDuration}
          onClose={handleClose}
        >
          <Alert
            variant="filled"
            severity={snackbarInitial.alertSeverity}
            sx={{
              bgcolor: `${snackbarInitial.alertSeverity  }.dark`,
              color: snackbarInitial.alertSeverity === "warning" ? "grey.800" : "",
            }}
            action={
              snackbarInitial.close !== false ? (
                <IconButton size="small" color="inherit" onClick={handleClickClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null
            }
          >
            {snackbarInitial.message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
}
