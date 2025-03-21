import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import clsx from "clsx";
import { makeStyles } from "components/Mui";

import Collapse from "../transitions/Collapse";
import { getSlideDirection, toSnackbarAnchorOrigin, keepSnackbarClassKeys } from "./utils";
import {
  TransitionHandlerProps,
  SnackbarProviderProps,
  CustomContentProps,
  InternalSnack,
  SharedProps,
} from "../types";
import createChainedFunction from "../utils/createChainedFunction";
import Snackbar from "./Snackbar";
import MaterialDesignContent from "../ui/MaterialDesignContent";

const useStyles = makeStyles({
  wrappedRoot: {
    position: "relative",
    transform: "translateX(0)",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    minWidth: "288px",
    margin: "6px 0",
  },
});

interface SnackbarItemProps extends Required<Pick<SnackbarProviderProps, "onEntered" | "onExited" | "onClose">> {
  snack: InternalSnack;
  classes: SnackbarProviderProps["classes"];
  onEnter: SnackbarProviderProps["onEnter"];
  onExit: SnackbarProviderProps["onExit"];
  Component?: React.ComponentType<CustomContentProps>;
}

export default function SnackbarItem(props: SnackbarItemProps) {
  const styles = useStyles();

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const [collapsed, setCollapsed] = useState(true);

  const handleClose: NonNullable<SharedProps["onClose"]> = createChainedFunction([props.snack.onClose, props.onClose]);

  const handleEntered: TransitionHandlerProps["onEntered"] = () => {
    if (props.snack.requestClose) {
      handleClose(null, "instructed", props.snack.id);
    }
  };

  const handleExitedScreen = useCallback((): void => {
    timeout.current = setTimeout(() => {
      setCollapsed((col) => !col);
    }, 125);
  }, []);

  useEffect(
    () => (): void => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    [],
  );

  const { snack, classes: allClasses, Component = MaterialDesignContent } = props;

  const classes = useMemo(() => keepSnackbarClassKeys(allClasses), [allClasses]);

  const {
    open,
    SnackbarProps,
    TransitionComponent,
    TransitionProps,
    transitionDuration,
    disableWindowBlurListener,
    content: componentOrFunctionContent,
    ...otherSnack
  } = snack;

  const transitionProps = {
    direction: getSlideDirection(otherSnack.anchorOrigin),
    timeout: transitionDuration,
    ...TransitionProps,
  };

  let content = componentOrFunctionContent;
  if (typeof content === "function") {
    content = content(otherSnack.id, otherSnack.message);
  }

  const callbacks: { [key in keyof TransitionHandlerProps]?: any } = (
    ["onEnter", "onEntered", "onExit", "onExited"] as (keyof TransitionHandlerProps)[]
  ).reduce(
    (acc, cbName) => ({
      ...acc,
      [cbName]: createChainedFunction([props.snack[cbName], props[cbName]]),
    }),
    {},
  );

  return (
    <Collapse id={otherSnack.id} unmountOnExit timeout={175} in={collapsed} onExited={callbacks.onExited}>
      <Snackbar
        open={open}
        id={otherSnack.id}
        disableWindowBlurListener={disableWindowBlurListener}
        autoHideDuration={otherSnack.autoHideDuration}
        className={clsx(styles.wrappedRoot, classes.root, classes[toSnackbarAnchorOrigin(otherSnack.anchorOrigin)])}
        SnackbarProps={SnackbarProps}
        onClose={handleClose}
      >
        <TransitionComponent
          {...transitionProps}
          id={otherSnack.id}
          in={open}
          onExit={callbacks.onExit}
          onExited={handleExitedScreen}
          onEnter={callbacks.onEnter}
          // order matters. first callbacks.onEntered to set entered: true,
          // then handleEntered to check if there's a request for closing
          onEntered={createChainedFunction([callbacks.onEntered, handleEntered])}
        >
          {/* @ts-ignore */}
          {content || <Component {...snack} onClose={() => handleClose(null, "instructed", props.snack.id)} />}
        </TransitionComponent>
      </Snackbar>
    </Collapse>
  );
}
