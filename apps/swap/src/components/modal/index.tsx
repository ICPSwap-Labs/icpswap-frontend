import { ReactNode } from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
} from "components/Mui";
import DialogCloseIcon from "assets/images/icons/dialog-close";
import { isElement } from "react-is";
import i18n from "i18n/index";

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
          padding: contentPadding ? `${contentPadding}!important` : "24px!important",
          ...(matchDownMD ? { padding: "12px", paddingTop: "12px!important" } : {}),
        },
        ...{
          "& .MuiPaper-root ": {
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
                <Button fullWidth size="large" onClick={onCancel} variant="outlined">
                  {cancelText}
                </Button>
              </Box>
            ) : null}
            {showConfirm ? (
              <Box>
                <Button disabled={confirmDisabled} fullWidth size="large" variant="contained" onClick={onConfirm}>
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
