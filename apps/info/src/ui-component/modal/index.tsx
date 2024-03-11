import React from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import DialogCloseIcon from "assets/images/icons/dialog-close";
import { Theme } from "@mui/material/styles";
import { isElement } from "react-is";

const useStyles = makeStyles((theme: Theme) => ({
  titleContainer: {
    position: "relative",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    "@media (max-width: 640px)": {
      fontSize: "1rem",
    },
    "&.warning": {
      color: "#D3625B",
    },
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
      color: theme.colors.primaryMain,
    },
    "&.warning": {
      color: "#D3625B",
      "&:hover": {
        color: "#D3625B",
      },
    },
  },
  closeButton1: {
    position: "absolute",
    right: "5px",
    top: "5px",
    cursor: "pointer",
    "&:hover": {
      color: theme.colors.primaryMain,
    },
    "&.warning": {
      color: "#D3625B",
      "&:hover": {
        color: "#D3625B",
      },
    },
  },
}));

export interface ModalProps {
  title?: string | React.ReactNode;
  showClose?: boolean;
  children: React.ReactNode;
  open: boolean;
  confirmText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  showConfirm?: boolean;
  confirmDisabled?: boolean;
  fullWidth?: boolean;
  maxWidth?: string;
  dialogProps?: any;
  type?: string;
  background?: string;
  [key: string]: any;
}

export default function Modal({
  title,
  children,
  open,
  confirmText = "Ok",
  onClose = () => {},
  onConfirm = () => {},
  showConfirm = false,
  showClose = true,
  confirmDisabled,
  fullWidth = true,
  maxWidth = "sm",
  type,
  background,
  dialogProps,
}: ModalProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...dialogProps}
      sx={{
        "& .MuiDialogTitle-root": {
          ...(matchDownMD ? { padding: "8px 14px" } : {}),
          "&+.MuiDialogContent-root": {
            paddingTop: "5px",
            ...(matchDownMD ? { paddingTop: "5px" } : {}),
          },
        },
        "& .MuiDialogContent-root": {
          position: "relative",
          ...(matchDownMD ? { padding: "8px 14px" } : {}),
        },
        ...{
          "& .MuiDialog-paper": {
            ...(background ? { backgroundColor: background } : { backgroundColor: theme.palette.background.level2 }),
          },
          ...(dialogProps?.sx || {}),
        },
      }}
    >
      {title ? (
        isElement(title) ? (
          title
        ) : (
          <DialogTitle>
            <Typography className={classes.titleContainer} component="div">
              <Typography className={`${classes.title} ${type ? type : ""}`} component="span" color="textPrimary">
                {title}
              </Typography>
              {showClose ? (
                <DialogCloseIcon onClick={onClose} className={`${classes.closeButton} ${type ? type : ""}`} />
              ) : null}
            </Typography>
          </DialogTitle>
        )
      ) : null}
      <DialogContent>
        {showClose && !title ? (
          <DialogCloseIcon onClick={onClose} className={`${classes.closeButton1} ${type ? type : ""} `} />
        ) : null}
        {children}
        {showConfirm ? (
          <Box mt={2}>
            <Button
              disableElevation
              disabled={confirmDisabled}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
