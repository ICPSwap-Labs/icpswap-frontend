import { useCallback, useEffect, useMemo, useState } from "react";
import { useUserPositionPools } from "@icpswap/hooks";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { slippageToPercent, getDefaultSlippageTolerance } from "constants/swap";
import { useAccount } from "store/auth/hooks";
import { Percent } from "@icpswap/swap-sdk";
import {
  updateUserExpertMode,
  updateUserSingleHop,
  updateUserSelectedToken,
  updateUserTransactionsDeadline,
  updateUserSlippage,
  updateTaggedTokens,
  removeTaggedTokens,
  updateShowClosedPosition,
  updateUserPositionPools,
  updateUserMultipleApprove,
  updateSwapProAutoRefresh,
} from "./actions";

export function useIsExpertMode() {
  return useAppSelector((state) => state.swapCache.userExpertMode);
}

export function useIsSingleHop() {
  return useAppSelector((state) => state.swapCache.userSingleHop);
}

export function useUserSlippage() {
  return useAppSelector((state) => state.swapCache.userSlippage);
}

export function useUserTransactionsDeadline() {
  return useAppSelector((state) => state.swapCache.userTransactionsDeadline);
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode(!expertMode));
  }, [dispatch, expertMode]);

  return [expertMode, toggleSetExpertMode];
}

export function useSingleHopManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const singleHop = useIsSingleHop();

  const toggleSetSingleHop = useCallback(() => {
    dispatch(updateUserSingleHop(!singleHop));
  }, [dispatch, singleHop]);

  return [singleHop, toggleSetSingleHop];
}

export function useUserSelectedToken() {
  return useAppSelector((state) => state.swapCache.userSelectedToken);
}

export function useMultipleApproveManager() {
  const dispatch = useAppDispatch();
  const multipleApprove = useAppSelector((state) => state.swapCache.multipleApprove);

  const updateMultipleApprove = useCallback(
    (multipleApprove: number) => {
      dispatch(updateUserMultipleApprove(multipleApprove));
    },
    [dispatch, multipleApprove],
  );

  return useMemo(() => ({ multipleApprove, updateMultipleApprove }), [updateMultipleApprove, multipleApprove]);
}

export function useSelectedTokenManage(): [string[], (tokenIds: string[]) => void] {
  const dispatch = useAppDispatch();
  const userSelectedToken = useUserSelectedToken();

  const setUserSelectedToken = useCallback(
    (checkedToken: string[]) => {
      dispatch(updateUserSelectedToken(checkedToken));
    },
    [dispatch],
  );
  return [userSelectedToken, setUserSelectedToken];
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

export function useSlippageToleranceToPercent(type: string) {
  const [slippageTolerance] = useSlippageManager(type);

  return useMemo(() => {
    if (slippageToPercent && slippageTolerance) {
      return slippageToPercent(slippageTolerance);
    }
    let percentSlippage: Percent | null = null;
    // input change will case error when value is 0.
    try {
      percentSlippage = slippageToPercent(getDefaultSlippageTolerance(type));
    } catch {
      percentSlippage = slippageToPercent(getDefaultSlippageTolerance(type));
    }
    return percentSlippage;
  }, [slippageTolerance, slippageToPercent]);
}

export function useTransactionsDeadlineManager(): [number, (value: number) => void] {
  const dispatch = useAppDispatch();
  const transactionDeadline = useUserTransactionsDeadline();

  const setTransactionsDeadline = useCallback(
    (value: number) => {
      dispatch(updateUserTransactionsDeadline(value));
    },
    [dispatch],
  );

  return [transactionDeadline, setTransactionsDeadline];
}

export function useTaggedTokenManager(): [string[], (tokens: string[]) => void, (tokens: string[]) => void] {
  const dispatch = useAppDispatch();

  const taggedTokens = useAppSelector((state) => state.swapCache.taggedTokens);

  const updateTaggedTokensCall = useCallback(
    (tokens: string[]) => {
      dispatch(updateTaggedTokens(tokens));
    },
    [dispatch],
  );

  const removeTaggedTokensCall = useCallback(
    (tokens: string[]) => {
      dispatch(removeTaggedTokens(tokens));
    },
    [dispatch],
  );

  return useMemo(
    () => [taggedTokens, updateTaggedTokensCall, removeTaggedTokensCall],
    [taggedTokens, updateTaggedTokensCall, removeTaggedTokensCall],
  );
}

export function useClosedPositionManager(): [boolean, (bool: boolean) => void] {
  const showClosedPosition = useAppSelector((state) => state.swapCache.showClosedPosition);
  const dispatch = useAppDispatch();

  const update = useCallback(
    (bool: boolean) => {
      dispatch(updateShowClosedPosition(bool));
    },
    [dispatch],
  );

  return useMemo(() => [showClosedPosition, update], [showClosedPosition, update]);
}

export function useStoreUserPositionPools() {
  return useAppSelector((state) => state.swapCache.userPositionPools);
}

export function useUpdateUserPositionPools() {
  const dispatch = useAppDispatch();

  return useCallback(
    (poolIds: string[]) => {
      dispatch(updateUserPositionPools(poolIds));
    },
    [dispatch],
  );
}

export function useInitialUserPositionPools() {
  const account = useAccount();

  const [initialLoading, setInitialLoading] = useState(true);

  const { result: positionPools, loading } = useUserPositionPools(account);

  const storeUserPositionPools = useStoreUserPositionPools();

  const updateStoreUserPositionPools = useUpdateUserPositionPools();

  useEffect(() => {
    if (positionPools) {
      const allPoolIds = [...new Set([...storeUserPositionPools, ...positionPools])];
      updateStoreUserPositionPools(allPoolIds);
      setInitialLoading(false);
    } else if (loading === false) {
      setInitialLoading(false);
    }
  }, [JSON.stringify(storeUserPositionPools), positionPools, updateStoreUserPositionPools, loading]);

  return {
    loading: initialLoading,
  };
}

export function useSwapProAutoRefresh() {
  return useAppSelector((state) => state.swapCache.swapProAutoRefresh);
}

export function useSwapProAutoRefreshManager(): [boolean, (autoRefresh: boolean) => void] {
  const dispatch = useAppDispatch();
  const swapProAutoRefresh = useSwapProAutoRefresh();

  const callback = useCallback(
    (autoRefresh: boolean) => {
      dispatch(updateSwapProAutoRefresh(autoRefresh));
    },
    [dispatch],
  );

  return useMemo(() => [swapProAutoRefresh, callback], [swapProAutoRefresh, callback]);
}
