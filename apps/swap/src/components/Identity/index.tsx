import React, { useState, useMemo, forwardRef, Ref, useImperativeHandle } from "react";
import isFunction from "lodash/isFunction";
import { Identity as AuthIdentity } from "types";
import { useFullscreenLoading } from "hooks/useTips";

export type SubmitLoadingProps = { loading: boolean; closeLoading: () => void };

export type IdentityProps = {
  password?: string | null | undefined;
  onSubmit: (
    identity: AuthIdentity | true,
    { loading, closeLoading }: SubmitLoadingProps,
    params?: any,
  ) => Promise<void>;
  children?: React.ReactNode | (({ submit }: CallbackProps) => JSX.Element);
  fullScreenLoading?: boolean;
};

export type Submit = (params?: any) => Promise<void>;

export type CallbackProps = {
  submit: Submit;
  loading: boolean;
};

export interface IdentityRef {
  submit: Submit;
}

function Identity({ onSubmit, children, fullScreenLoading }: IdentityProps, ref: Ref<IdentityRef>) {
  const [commonLoading, setCommonLoading] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading, fullLoading] = useFullscreenLoading();

  const openLoading = () => {
    if (fullScreenLoading) {
      openFullscreenLoading();
    } else {
      setCommonLoading(true);
    }
  };

  const closeLoading = () => {
    if (fullScreenLoading) {
      closeFullscreenLoading();
    } else {
      setCommonLoading(false);
    }
  };

  const loading = useMemo(() => {
    if (fullScreenLoading) return fullLoading;
    return commonLoading;
  }, [fullLoading, commonLoading]);

  const submit: Submit = async (params?: any) => {
    try {
      // TODO: Actor.create use un-anonymous
      openLoading();
      await onSubmit(true, { loading, closeLoading }, params);
      closeLoading();
    } catch (error) {
      console.error(error);
      closeLoading();
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      submit,
    }),
    [],
  );

  return <>{isFunction(children) ? children({ submit, loading }) : children}</>;
}

export async function getActorIdentity(): Promise<AuthIdentity | true> {
  return true;
}

export default forwardRef(Identity);
