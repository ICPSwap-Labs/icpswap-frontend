import { memo, forwardRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import DialogCloseIcon from "assets/images/icons/dialog-close";
import { Theme } from "@mui/material/styles";
import SnackbarContent from "../../SnackbarContent";
import { CustomContentProps } from "../../types";
import { ComponentClasses } from "../../utils/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      backgroundColor: theme.palette.background.level3, // dark grey
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
      color: "#fff",
      alignItems: "center",
      padding: "24px 26px",
      borderRadius: "8px",
      boxShadow:
        "0px 3px 28px 1px rgba(0, 0, 0, 0.14), 0px 0px 6px 0px rgba(0, 0, 0, 0.12), 0px 0px 16px 9px rgba(0, 0, 0, 0.08)",
      position: "relative",
      paddingRight: "70px",
      overflow: "hidden",
      display: "block",
      "&.loading": {
        paddingRight: "26px",
      },
    },
    iconWrapper: {
      width: "42px",
    },
    message: {
      display: "flex",
      alignItems: "flex-start",
    },
    messageContent: {
      maxWidth: "214px",
      margin: "0",
      wordBreak: "break-word",
      fontWeight: 500,
    },
    extraContent: {
      paddingLeft: "42px",
      marginTop: "6px",
    },
    action: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      paddingLeft: "16px",
      marginRight: "-8px",
    },
    close: {
      position: "absolute",
      right: "18px",
      top: "18px",
      cursor: "pointer",
      color: "#8492C4",
    },
    line: {
      position: "absolute",
      width: "100%",
      height: "2px",
      bottom: 0,
      left: 0,
      borderRadius: "0 0 8px 8px",
      "&.tick": {
        width: "0px",
        borderRadius: "0 0 0 8px",
      },
      "&.success": {
        backgroundColor: theme.colors.successDark,
      },
      "&.error": {
        backgroundColor: theme.colors.warning,
      },
    },
  };
});

const MaterialDesignContent = forwardRef<HTMLDivElement, CustomContentProps>((props, forwardedRef) => {
  const { id, message, action: componentOrFunctionAction, iconVariant, variant, hideIconVariant, style } = props;

  const [tick, setTick] = useState(false);

  const classes = useStyles();

  const icon = iconVariant[variant];

  let action = componentOrFunctionAction;
  if (typeof action === "function") {
    action = action(id);
  }

  const isLoading = variant === "loading";

  useEffect(() => {
    setTick(true);
  }, [setTick]);

  return (
    <SnackbarContent
      ref={forwardedRef}
      role="alert"
      style={style}
      className={clsx(ComponentClasses.MuiContent, classes.root, variant)}
    >
      <div id="notistack-snackbar" className={`${classes.message} ${variant}`}>
        {!hideIconVariant ? <div className={classes.iconWrapper}>{icon}</div> : null}
        <div className={classes.messageContent}>{message}</div>
        {/* @ts-ignore */}
        {!isLoading ? <DialogCloseIcon className={`${classes.close}`} onClick={props.onClose} /> : ""}
      </div>

      {props.extraContent ? <div className={`${classes.extraContent}`}>{props.extraContent}</div> : null}

      {action && <div className={classes.action}>{action}</div>}

      {!isLoading ? (
        <Box
          className={clsx(classes.line, variant, tick ? "tick" : "")}
          sx={{ transition: `width ${props.autoHideDuration}ms linear` }}
        />
      ) : null}
    </SnackbarContent>
  );
});

export default memo(MaterialDesignContent);
