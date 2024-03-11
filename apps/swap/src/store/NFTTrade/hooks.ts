import { useCallback, useMemo } from "react";
import { updateAllowance } from "./actions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Allowance } from "../../types/nft";

export function useUserAllowance() {
  return useAppSelector((state) => state.NFTTrade.allowance);
}

export function useAllowanceManager(): [Allowance[], (allowance: Allowance[]) => void] {
  const allowance = useUserAllowance();
  const dispatch = useAppDispatch();

  const updateAllowanceCallback = useCallback(
    (allowance: Allowance[]) => {
      dispatch(updateAllowance(allowance));
    },
    [dispatch],
  );

  return [allowance, updateAllowanceCallback];
}

export function useIsAllowedCallback(): (spender: string, tokenIndex: number) => boolean {
  const userAllowance = useUserAllowance();

  return useCallback((spender: string, tokenIndex: number) => {
    return !!userAllowance.filter(
      ({ spender: _spender, tokenIndex: _tokenIndex }: Allowance) => spender === _spender && tokenIndex === _tokenIndex,
    )[0];
  }, []);
}

export function useIsAllowed(spender: string, tokenIndex: number): boolean {
  const getIsAllowed = useIsAllowedCallback();
  return useMemo(() => getIsAllowed(spender, tokenIndex), [getIsAllowed, spender, tokenIndex]);
}
