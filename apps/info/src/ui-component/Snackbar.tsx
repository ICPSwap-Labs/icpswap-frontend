import React from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Fade, Alert } from "@mui/material";
import MuiSnackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { SNACKBAR_CLOSE } from "store/snackbarReducer";

export default function Snackbar() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const snackbarInitial = useAppSelector((state) => state.snackbar);

  const handleClose = (event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    dispatch(SNACKBAR_CLOSE());
  };

  React.useEffect(() => {
    setOpen(snackbarInitial.open);
  }, [snackbarInitial.action, snackbarInitial.open]);

  return (
    <MuiSnackbar
      TransitionComponent={Fade}
      anchorOrigin={snackbarInitial.anchorOrigin}
      open={open}
      autoHideDuration={snackbarInitial.autoHideDuration}
      onClose={handleClose}
    >
      <Alert variant="filled" severity={snackbarInitial.alertSeverity}>
        {snackbarInitial.message}
      </Alert>
    </MuiSnackbar>
  );
}
