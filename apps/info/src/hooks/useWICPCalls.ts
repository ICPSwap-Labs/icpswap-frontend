import { useCallback, useMemo } from "react";
import { resultFormat } from "@icpswap/utils";
import { useWrapTransactions, useCallsData, useTokenBalance } from "@icpswap/hooks";
import { wrapICP } from "@icpswap/actor";
import { WICPCanisterId, ICPCanisterId } from "constants/index";
import BigNumber from "bignumber.js";

export function useWrapOverview() {
  const { result: icpBalance } = useTokenBalance({ canisterId: ICPCanisterId, address: WICPCanisterId });

  const { result: wicpSupply } = useCallsData(
    useCallback(async () => {
      return resultFormat<bigint>(await (await wrapICP()).supply()).data;
    }, []),
  );

  const { result: totalHolders } = useCallsData(
    useCallback(async () => {
      return resultFormat<bigint>(await (await wrapICP()).totalHolders()).data;
    }, []),
  );

  const { result: wrapTransactions } = useWrapTransactions(undefined, 0, 10);

  const { totalElements } = wrapTransactions ?? { totalElements: 0 };

  const { result: cyclesBalance } = useCallsData(
    useCallback(async () => {
      return resultFormat<bigint>(await (await wrapICP()).cycleBalance()).data;
    }, []),
  );

  return useMemo(() => {
    return {
      balance: icpBalance ?? new BigNumber(0),
      supply: wicpSupply ?? BigInt(0),
      cyclesBalance: cyclesBalance ?? BigInt(0),
      holders: totalHolders ?? BigInt(0),
      counts: totalElements,
    };
  }, [icpBalance, wicpSupply, totalHolders, wrapTransactions, cyclesBalance]);
}
