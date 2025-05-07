import React, { ReactNode } from "react";
import { XCircle } from "react-feather";
import { isElement } from "react-is";

import {
  makeStyles,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useMediaQuery,
  Theme,
  Box,
} from "../Mui";

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
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  showConfirm?: boolean;
  showCancel?: boolean;
  confirmDisabled?: boolean;
  fullWidth?: boolean;
  maxWidth?: string;
  dialogWidth?: string;
  dialogProps?: any;
  type?: string;
  background?: string;
  [key: string]: any;
}

export function Modal({
  title,
  children,
  open,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  onCancel,
  showConfirm = false,
  showCancel = false,
  showClose = true,
  confirmDisabled,
  fullWidth = true,
  maxWidth = "sm",
  type,
  background,
  dialogProps,
  dialogWidth = "570px",
}: ModalProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const down760 = useMediaQuery("(max-width:760px)");

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...dialogProps}
      sx={{
        "& .MuiDialog-paper, & .MuiPaper-root": {
          padding: "0",
        },
        "& .MuiDialogTitle-root": {
          padding: "24px 24px 0 24px",
          ...(matchDownMD ? { padding: "12px 12px 0 12px" } : {}),
        },
        "& .MuiDialogContent-root": {
          position: "relative",
          padding: "24px",
          paddingTop: "24px!important",
          ...(matchDownMD ? { padding: "12px", paddingTop: "12px!important" } : {}),
        },
        ...{
          "& .MuiPaper-root": {
            width: dialogWidth,
            ...(background
              ? { backgroundColor: background === "level1" ? theme.palette.background.level1 : background }
              : { backgroundColor: theme.palette.background.level2 }),
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
            <Typography sx={{ position: "relative" }} component="div">
              <Typography className={`${classes.title} ${type || ""}`} component="span" color="textPrimary">
                {title}
              </Typography>
              {showClose ? <XCircle onClick={onClose} className={`${classes.closeButton} ${type || ""}`} /> : null}
            </Typography>
          </DialogTitle>
        )
      ) : null}
      <DialogContent>
        {showClose && !title ? (
          <XCircle onClick={onClose} className={`${classes.closeButton1} ${type || ""} `} />
        ) : null}
        {children}

        {showConfirm || showCancel ? (
          <Box
            sx={{
              display: "grid",
              justifyContent: "flex-end",
              gridTemplateColumns: down760 ? "1fr" : showConfirm && showCancel ? "1fr 1fr" : "1fr",
              gap: down760 ? "10px 10px" : "0 10px",
              margin: "32px 0 0 0",
            }}
          >
            {showCancel ? (
              <Button onClick={onCancel} variant="contained" className="secondary" size="large">
                {cancelText}
              </Button>
            ) : null}

            {showConfirm ? (
              <Button disabled={confirmDisabled} variant="contained" onClick={onConfirm} size="large">
                {confirmText}
              </Button>
            ) : null}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
