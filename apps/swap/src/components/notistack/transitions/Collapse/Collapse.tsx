/* eslint-disable no-param-reassign */

/**
 * Credit to MUI team @ https://mui.com
 */
import * as React from "react";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import TransitionComponent, { TransitionStatus } from "../Transition";
import useForkRef from "../useForkRef";
import { TransitionHandlerProps, TransitionProps } from "../../types";
import getAutoHeightDuration from "../getAutoHeightDuration";
import getTransitionProps from "../getTransitionProps";
import createTransition from "../createTransition";
import { ComponentClasses } from "../../utils/styles";

const useStyles = makeStyles({
  root: {
    height: 0,
  },
  entered: {
    height: "auto",
  },
});

const collapsedSize = "0px";

const Collapse = React.forwardRef<HTMLDivElement | null, TransitionProps>((props, ref) => {
  const { children, style, timeout = 300, in: inProp, onEnter, onEntered, onExit, onExited, ...other } = props;

  const classes = useStyles();

  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const autoTransitionDuration = React.useRef<number>();

  React.useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const nodeRef = React.useRef(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, nodeRef);

  const getWrapperSize = () => (wrapperRef.current ? wrapperRef.current.clientHeight : 0);

  const handleEnter: TransitionHandlerProps["onEnter"] = (node, isAppearing, snackId) => {
    node.style.height = collapsedSize;
    if (onEnter) {
      onEnter(node, isAppearing, snackId);
    }
  };

  const handleEntering = (node: HTMLElement) => {
    const wrapperSize = getWrapperSize();

    const { duration: transitionDuration, easing } = getTransitionProps({
      style,
      timeout,
      mode: "enter",
    });

    if (timeout === "auto") {
      const duration2 = getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === "string" ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style.height = `${wrapperSize}px`;
    node.style.transitionTimingFunction = easing || "";
  };

  const handleEntered: TransitionHandlerProps["onEntered"] = (node, isAppearing, snackId) => {
    node.style.height = "auto";
    if (onEntered) {
      onEntered(node, isAppearing, snackId);
    }
  };

  const handleExit: TransitionHandlerProps["onExit"] = (node, snackId) => {
    node.style.height = `${getWrapperSize()}px`;
    if (onExit) {
      onExit(node, snackId);
    }
  };

  const handleExiting = (node: HTMLElement) => {
    const wrapperSize = getWrapperSize();
    const { duration: transitionDuration, easing } = getTransitionProps({
      style,
      timeout,
      mode: "exit",
    });

    if (timeout === "auto") {
      const duration2 = getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === "string" ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style.height = collapsedSize;
    node.style.transitionTimingFunction = easing || "";
  };

  const handleAddEndListener = (next: any) => {
    if (timeout === "auto") {
      timer.current = setTimeout(next, autoTransitionDuration.current || 0);
    }
  };

  return (
    <TransitionComponent
      // @ts-ignore
      in={inProp}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={onExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={timeout === "auto" ? null : timeout}
      {...other}
    >
      {(state: TransitionStatus, childProps: Record<string, any>) => (
        <div
          ref={handleRef}
          className={clsx(classes.root, { [classes.entered]: state === "entered" })}
          style={{
            pointerEvents: "all",
            overflow: "hidden",
            minHeight: collapsedSize,
            transition: createTransition("height"),
            ...(state === "entered" && {
              overflow: "visible",
            }),
            ...(state === "exited" &&
              !inProp && {
                visibility: "hidden",
              }),
            ...style,
          }}
          {...childProps}
        >
          <div
            ref={wrapperRef}
            className={ComponentClasses.CollapseWrapper}
            // Hack to get children with a negative margin to not falsify the height computation.
            style={{ display: "flex" }}
          >
            <div style={{ width: "100%" }}>{children}</div>
          </div>
        </div>
      )}
    </TransitionComponent>
  );
});

export default Collapse;
