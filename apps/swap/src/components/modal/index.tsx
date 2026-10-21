import DialogCloseIcon from "assets/images/icons/dialog-close";
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
} from "components/Mui";
import { useMediaQueryMD } from "hooks/theme";
import i18n from "i18n/index";
import type { ReactNode } from "react";
import { isElement } from "react-is";

const useStyles = makeStyles(() => ({
  titleContainer: {
    position: "relative",
    paddingRight: "36px",
    lineHeight: 1.4,
  },
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
    color: "color-mix(in srgb, var(--color-base-content) 48%, transparent)",
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
    color: "color-mix(in srgb, var(--color-base-content) 48%, transparent)",
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
}));

export interface ModalProps {
  title?: string | ReactNode;
  showClose?: boolean;
  children: ReactNode;
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
  dialogProps?: any;
  type?: string;
  background?: string;
  contentPadding?: string;
  [key: string]: any;
}

export default function Modal({
  title,
  children,
  open,
  confirmText = i18n.t("common.confirm"),
  cancelText = i18n.t("common.cancel"),
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
  contentPadding,
}: ModalProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const matchDownMD = useMediaQueryMD();

  const down760 = useMediaQuery("(max-width:760px)");

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...dialogProps}
      sx={{
        "& .MuiBackdrop-root": {
          background: "color-mix(in srgb, var(--color-neutral) 74%, transparent)",
          backdropFilter: "blur(12px)",
        },
        "& .MuiDialog-paper, & .MuiPaper-root": {
          padding: "0",
        },
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 12%, transparent)",
          boxShadow:
            "0 32px 100px color-mix(in srgb, var(--color-neutral) 50%, transparent), 0 0 60px color-mix(in srgb, var(--color-primary) 7%, transparent)",
          backgroundImage:
            "radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 55%)",
        },
        "& .MuiDialogTitle-root": {
          padding: "28px 28px 0",
          ...(matchDownMD ? { padding: "20px 20px 0" } : {}),
        },
        "& .MuiDialogContent-root": {
          position: "relative",
          padding: contentPadding ? `${contentPadding}!important` : "24px 28px 28px!important",
          ...(matchDownMD && !contentPadding ? { padding: "20px!important" } : {}),
        },
        ...{
          "& .MuiPaper-root ": {
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
            <Typography className={classes.titleContainer} component="div">
              <Typography className={`${classes.title} ${type || ""}`} component="span" color="textPrimary">
                {title}
              </Typography>
              {showClose ? (
                <DialogCloseIcon onClick={onClose} className={`${classes.closeButton} ${type || ""}`} />
              ) : null}
            </Typography>
          </DialogTitle>
        )
      ) : null}
      <DialogContent>
        {showClose && !title ? (
          <DialogCloseIcon onClick={onClose} className={`${classes.closeButton1} ${type || ""} `} />
        ) : null}
        {children}

        {showConfirm || showCancel ? (
          <Box
            mt="20px"
            sx={{
              display: "grid",
              gridTemplateColumns: down760 ? "1fr" : showConfirm && showCancel ? "1fr 1fr" : "1fr",
              gap: down760 ? "10px 0" : "0 10px",
            }}
          >
            {showCancel ? (
              <Box>
                <Button fullWidth size="large" onClick={onCancel} variant="outlined" className="btn btn-outline">
                  {cancelText}
                </Button>
              </Box>
            ) : null}
            {showConfirm ? (
              <Box>
                <Button
                  disabled={confirmDisabled}
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={onConfirm}
                  className="btn btn-primary"
                >
                  {confirmText}
                </Button>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
