// @ts-nocheck
/* eslint-disable */

import React from "react";
import { TransitionStatus } from "./types";

class Transition extends React.Component {
  constructor(props: any) {
    super(props);

    const { appear } = props;

    let initialStatus;

    this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = TransitionStatus.EXITED;
        this.appearStatus = TransitionStatus.ENTERING;
      } else {
        initialStatus = TransitionStatus.ENTERED;
      }
    } else if (props.unmountOnExit || props.mountOnEnter) {
      initialStatus = TransitionStatus.UNMOUNTED;
    } else {
      initialStatus = TransitionStatus.EXITED;
    }

    this.state = { status: initialStatus };

    this.nextCallback = null;
  }

  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    if (nextIn && prevState.status === TransitionStatus.UNMOUNTED) {
      return { status: TransitionStatus.EXITED };
    }
    return null;
  }

  componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  }

  componentDidUpdate(prevProps) {
    let nextStatus = null;
    if (prevProps !== this.props) {
      const { status } = this.state;

      if (this.props.in) {
        if (status !== TransitionStatus.ENTERING && status !== TransitionStatus.ENTERED) {
          nextStatus = TransitionStatus.ENTERING;
        }
      } else if (status === TransitionStatus.ENTERING || status === TransitionStatus.ENTERED) {
        nextStatus = TransitionStatus.EXITING;
      }
    }
    this.updateStatus(false, nextStatus);
  }

  componentWillUnmount() {
    this.cancelNextCallback();
  }

  getTimeouts() {
    const { timeout } = this.props;
    let enter = timeout;
    let exit = timeout;

    if (timeout != null && typeof timeout !== "number") {
      exit = timeout.exit;
      enter = timeout.enter;
    }
    return { exit, enter };
  }

  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      this.cancelNextCallback();

      if (nextStatus === TransitionStatus.ENTERING) {
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === TransitionStatus.EXITED) {
      this.setState({ status: TransitionStatus.UNMOUNTED });
    }
  }

  get node() {
    const node = this.props.nodeRef.current;
    if (!node) {
      throw new Error("notistack - Custom snackbar is not refForwarding");
    }
    return node;
  }

  performEnter(mounting) {
    const { enter, id } = this.props;
    const isAppearing = mounting;

    const timeouts = this.getTimeouts();

    if (!mounting && !enter) {
      this.safeSetState({ status: TransitionStatus.ENTERED }, () => {
        this.props.onEntered(this.node, isAppearing, id);
      });
      return;
    }

    this.props.onEnter(this.node, isAppearing, id);

    this.safeSetState({ status: TransitionStatus.ENTERING }, () => {
      this.props.onEntering(this.node, isAppearing, id);

      this.onTransitionEnd(timeouts.enter, () => {
        this.safeSetState({ status: TransitionStatus.ENTERED }, () => {
          this.props.onEntered(this.node, isAppearing, id);
        });
      });
    });
  }

  performExit() {
    const { exit, id } = this.props;
    const timeouts = this.getTimeouts();

    // no exit animation skip right to EXITED
    if (!exit) {
      this.safeSetState({ status: TransitionStatus.EXITED }, () => {
        this.props.onExited(this.node, id);
      });
      return;
    }

    this.props.onExit(this.node, id);

    this.safeSetState({ status: TransitionStatus.EXITING }, () => {
      this.props.onExiting(this.node, id);

      this.onTransitionEnd(timeouts.exit, () => {
        this.safeSetState({ status: TransitionStatus.EXITED }, () => {
          this.props.onExited(this.node, id);
        });
      });
    });
  }

  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  }

  safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  }

  setNextCallback(callback) {
    let active = true;

    this.nextCallback = (event) => {
      if (active) {
        active = false;
        this.nextCallback = null;

        callback(event);
      }
    };

    this.nextCallback.cancel = () => {
      active = false;
    };

    return this.nextCallback;
  }

  onTransitionEnd(timeout, handler) {
    this.setNextCallback(handler);
    const doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;
    if (!this.node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      this.props.addEndListener(this.node, this.nextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  }

  render() {
    const { status } = this.state;

    if (status === TransitionStatus.UNMOUNTED) {
      return null;
    }

    const {
      children,
      // filter props for `Transition`
      id: _id,
      in: _in,
      mountOnEnter: _mountOnEnter,
      unmountOnExit: _unmountOnExit,
      appear: _appear,
      enter: _enter,
      exit: _exit,
      timeout: _timeout,
      addEndListener: _addEndListener,
      onEnter: _onEnter,
      onEntering: _onEntering,
      onEntered: _onEntered,
      onExit: _onExit,
      onExiting: _onExiting,
      onExited: _onExited,
      nodeRef: _nodeRef,
      ...childProps
    } = this.props;

    return children(status, childProps);
  }
}

function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop,
};

export default Transition;
