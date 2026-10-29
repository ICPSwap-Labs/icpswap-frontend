import type React from "react";
import type { ReactNode } from "react";
import { XCircle } from "react-feather";
import { isElement } from "react-is";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  type Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "../Mui";

const useStyles = makeStyles((theme: Theme) => {
  return theme.customization?.designVersion !== "modern"
    ? {
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
      }
    : {
        title: {
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.035em",
          "@media (max-width: 640px)": {
            fontSize: "1rem",
          },
          "&.warning": {
            color: "var(--color-error)",
          },
        },
        closeButton: {
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translate(0, -50%)",
          cursor: "pointer",
          color: "color-mix(in srgb, var(--color-base-content) 45%, transparent)",
          transition: "color 160ms ease",
          "&:hover": {
            color: "var(--color-primary)",
          },
          "&.warning": {
            color: "var(--color-error)",
            "&:hover": {
              color: "var(--color-error)",
            },
          },
        },
        closeButton1: {
          position: "absolute",
          right: "5px",
          top: "5px",
          cursor: "pointer",
          color: "color-mix(in srgb, var(--color-base-content) 45%, transparent)",
          transition: "color 160ms ease",
          "&:hover": {
            color: "var(--color-primary)",
          },
          "&.warning": {
            color: "var(--color-error)",
            "&:hover": {
              color: "var(--color-error)",
            },
          },
        },
      };
});

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
  const isClassicDesign = useTheme().customization?.designVersion !== "modern";

  const classes = useStyles();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const down760 = useMediaQuery("(max-width:760px)");

  if (isClassicDesign) {
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

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...dialogProps}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "color-mix(in srgb, var(--color-neutral) 72%, transparent)",
          backdropFilter: "blur(4px)",
        },
        "& .MuiDialog-paper, & .MuiPaper-root": {
          padding: "0",
          borderRadius: "8px",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 12%, transparent)",
          boxShadow: "none",
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
              : { backgroundColor: "var(--color-base-100)" }),
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
              <Button onClick={onCancel} variant="contained" className="btn btn-ghost secondary" size="large">
                {cancelText}
              </Button>
            ) : null}

            {showConfirm ? (
              <Button
                disabled={confirmDisabled}
                variant="contained"
                onClick={onConfirm}
                size="large"
                className="btn btn-primary"
              >
                {confirmText}
              </Button>
            ) : null}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
