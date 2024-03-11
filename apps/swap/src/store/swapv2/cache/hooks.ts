import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateUserSlippage } from "./actions";

export function useIsExpertMode() {
  return useAppSelector((state) => state.swapV2Cache.userExpertMode);
}

export function useIsSingleHop() {
  return useAppSelector((state) => state.swapV2Cache.userSingleHop);
}

export function useUserSlippage() {
  return useAppSelector((state) => state.swapV2Cache.userSlippage);
}

export function useUserTransactionsDeadline() {
  return useAppSelector((state) => state.swapV2Cache.userTransactionsDeadline);
}

export function useSlippageManager(type: string): [number, (value: number) => void] {
  const dispatch = useAppDispatch();
  const userSlippage = useUserSlippage()[type];

  const setUserSlippage = useCallback(
    (value: number) => {
      dispatch(updateUserSlippage({ type, value }));
    },
    [dispatch],
  );

  return [userSlippage, setUserSlippage];
}
