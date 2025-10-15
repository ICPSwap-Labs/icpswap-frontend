import React, { memo } from "react";
import clsx from "clsx";
import { makeStyles } from "components/Mui";
import createTransition from "components/notistack/transitions/createTransition";
import { ComponentClasses } from "components/notistack/utils/styles";
import { breakpoints, originKeyExtractor } from "components/notistack/utils";
import { ContainerClassKey, SnackbarProviderProps } from "components/notistack/types";
import { useWalletContext } from "components/Wallet/context";
import { WALLET_DRAWER_WIDTH } from "constants/wallet";

const indents = {
  view: { default: 20, dense: 4 },
  snackbar: { default: 6, dense: 2 },
};

const collapseWrapper = `.${ComponentClasses.CollapseWrapper}`;

const xsWidthMargin = 16;

const useStyles = ({ walletOpen }: { walletOpen: boolean }) => {
  return makeStyles({
    root: {
      boxSizing: "border-box",
      display: "flex",
      maxHeight: "100%",
      position: "fixed",
      zIndex: 1400,
      height: "auto",
      width: "auto",
      transition: createTransition(["top", "right", "bottom", "left", "max-width"], { duration: 300, easing: "ease" }),
      // container itself is invisible and should not block clicks, clicks should be passed to its children
      // a pointerEvents: all is applied in the collapse component
      pointerEvents: "none",
      [collapseWrapper]: {
        padding: `${indents.snackbar.default}px 0px`,
        transition: "padding 300ms ease 0ms",
      },
      maxWidth: `calc(100% - ${indents.view.default * 2}px)`,
      [breakpoints.downXs]: {
        width: "100%",
        maxWidth: `calc(100% - ${xsWidthMargin * 2}px)`,
      },
    },
    rootDense: {
      [collapseWrapper]: {
        padding: `${indents.snackbar.dense}px 0px`,
      },
    },
    top: {
      top: "60px",
      flexDirection: "column",
    },
    bottom: {
      bottom: `${indents.view.default - indents.snackbar.default}px`,
      flexDirection: "column-reverse",
    },
    left: {
      left: `${indents.view.default}px`,
      [breakpoints.upSm]: {
        alignItems: "flex-start",
      },
      [breakpoints.downXs]: {
        left: `${xsWidthMargin}px`,
      },
    },
    right: {
      right: walletOpen ? `${indents.view.default + WALLET_DRAWER_WIDTH}px` : `${indents.view.default}px`,
      [breakpoints.upSm]: {
        alignItems: "flex-end",
      },
      [breakpoints.downXs]: {
        right: `${xsWidthMargin}px`,
      },
    },
    center: {
      left: "50%",
      transform: "translateX(-50%)",
      [breakpoints.upSm]: {
        alignItems: "center",
      },
    },
  });
};

interface SnackbarContainerProps {
  children: React.ReactNode;
  dense: SnackbarProviderProps["dense"];
  anchorOrigin: NonNullable<SnackbarProviderProps["anchorOrigin"]>;
  classes: SnackbarProviderProps["classes"];
}

const SnackbarContainer: React.FC<SnackbarContainerProps> = (props) => {
  const { classes = {}, anchorOrigin, dense, children } = props;

  const { open } = useWalletContext();
  const styles = useStyles({ walletOpen: open })();

  const combinedClassname = clsx(
    ComponentClasses.SnackbarContainer,
    styles[anchorOrigin.vertical],
    styles[anchorOrigin.horizontal],
    { [styles.rootDense]: dense },
    styles.root, // root should come after others to override maxWidth
    classes.containerRoot,
    classes[`containerAnchorOrigin${originKeyExtractor(anchorOrigin)}` as ContainerClassKey],
  );

  return <div className={combinedClassname}>{children}</div>;
};

export default memo(SnackbarContainer);
