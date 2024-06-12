import { useCallback, useMemo, useState, useEffect } from "react";
import { usePaginationAllData, getPaginationAllData, useCallsData } from "@icpswap/hooks";

import { TOKEN_STANDARD, ResultStatus } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { Principal } from "@dfinity/principal";
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getSteps } from "views/staking-token/v1/components/Step";
import { useStepContentManager } from "store/steps/hooks";
import { useTokenTransferOrApprove } from "hooks/token/useTokenTransferOrApprove";
import type {
  StakingPoolGlobalData,
  StakingTokenPoolInfo,
  UserStakingInfo,
  UnusedBalance,
} from "types/staking-token-v1/index";
import { SubAccount } from "@dfinity/ledger-icp";

import {
  getStakingTokenGlobalData,
  stakingTokenDeposit,
  stakingTokenDepositFrom,
  getStakingTokenPools,
  getStakingTokenCycles,
  stakingTokenWithdraw,
  stakingTokenHarvest,
  getStakingTokenUserInfo,
  getStakingTokenPool,
} from "./index";

export function useStakingGlobalData(): [StakingPoolGlobalData | undefined, () => void] {
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [data, setData] = useState<StakingPoolGlobalData | undefined>({
    rewardAmount: 0,
    stakingAmount: 0,
  });

  useEffect(() => {
    const call = async () => {
      const data = await getStakingTokenGlobalData();
      setData(data);
    };

    call();
  }, [forceUpdate]);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, [setForceUpdate]);

  return [data, update];
}

export function useStakingTokenDeposit() {
  const [openErrorTip] = useErrorTip();

  return useCallback(async (token: Token, amount: string, poolId: string, options?: TIP_OPTIONS) => {
    const identity = await getActorIdentity();

    const useTransfer = isUseTransfer(token);

    let status: ResultStatus = ResultStatus.ERROR;
    let message = "";

    if (useTransfer) {
      const { status: _status, message: _message } = await stakingTokenDeposit(poolId, identity);
      status = _status;
      message = _message;
    } else {
      const { status: _status, message: _message } = await stakingTokenDepositFrom(poolId, identity, BigInt(amount));
      status = _status;
      message = _message;
    }

    if (status === "err") {
      openErrorTip(`Failed to deposit ${token.symbol}: ${message}`, options);
      return false;
    }

    return true;
  }, []);
}

export async function getAllTokenPools() {
  const call = async (offset: number, limit: number) => {
    return await getStakingTokenPools(undefined, offset, limit);
  };

  return getPaginationAllData(call, 500);
}

export function useStakingTokenAllPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getStakingTokenPools(undefined, offset, limit);
  }, []);

  return usePaginationAllData(call, 500);
}

export function useUserUnusedTokens(reload?: boolean) {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<UnusedBalance[]>([]);
  const principal = useAccountPrincipal();

  const { result, loading: poolsLoading } = useStakingTokenAllPools();

  // filter standard dip20, because dip20 use transferFrom, no unused tokens
  const pools = useMemo(() => {
    return result.filter((ele) => ele.stakingToken.standard !== TOKEN_STANDARD.DIP20);
  }, [result]);

  useEffect(() => {
    const call = async () => {
      if (pools && principal) {
        setLoading(true);

        const calls = pools.map(async (ele) => {
          return await getTokenBalance(
            ele.stakingToken.address,
            Principal.fromText(ele.canisterId),
            SubAccount.fromPrincipal(principal).toUint8Array(),
          );
        });

        const _result = await Promise.all(calls);

        const data = _result
          .map((ele, index) => {
            if (ele.status === ResultStatus.OK && ele.data) {
              return {
                balance: ele.data,
                ...pools[index],
              } as UnusedBalance;
            }
            return null;
          })
          .filter((ele) => !!ele) as UnusedBalance[];

        setBalances(data);

        setLoading(false);
      }
    };

    call();

    if (!poolsLoading && !pools) {
      setLoading(false);
    }
  }, [pools, principal, poolsLoading, reload]);

  return useMemo(() => {
    return {
      loading: poolsLoading || loading,
      result: balances,
    };
  }, [poolsLoading, loading, balances]);
}

export function usePoolCycles(canisterId: string | undefined, version: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return (await getStakingTokenCycles(canisterId))?.balance;
    }, [canisterId, version]),
  );
}

type StakingProps = {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
};

function useSteps() {
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback((key: string, { token, amount }: StakingProps) => {
    const content = getSteps({
      token,
      amount,
    });

    initialAndUpdateDetails(String(key), {
      content,
      title: t`Staking Details`,
    });
  }, []);
}

function useCalls() {
  const approveOrTransfer = useTokenTransferOrApprove();
  const deposit = useStakingTokenDeposit();

  return useCallback(({ token, amount, poolId, standard }: StakingProps) => {
    const firstCall = async () => await approveOrTransfer({ token, amount, to_owner: poolId, standard });
    const secondCall = async () => await deposit(token, amount, poolId);

    return [firstCall, secondCall];
  }, []);
}

export function useStakingToken() {
  const updateStep = useSteps();
  const formatCall = useStepCalls();
  const getCalls = useCalls();

  return useCallback(
    ({ token, amount, poolId, standard }: StakingProps) => {
      const key = newStepKey();
      const calls = getCalls({ token, amount, poolId, standard });
      const { call, reset, retry } = formatCall(calls, key);

      updateStep(key, { token, amount, poolId, standard });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, updateStep],
  );
}

export async function withdraw(poolId: string, amount: bigint) {
  return await stakingTokenWithdraw(poolId, true, amount);
}

export async function harvest(poolId: string) {
  return await stakingTokenHarvest(poolId, true);
}

export function useUserStakingInfo(
  poolId: string | undefined,
  version: string | undefined,
  account: string | undefined,
): [UserStakingInfo | undefined, () => void] {
  const [userInfo, setUserInfo] = useState<UserStakingInfo | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId || !account) return;

      const result = await getStakingTokenUserInfo(poolId, account);

      if (result) {
        setUserInfo({
          amount: result.amount,
          reward: result.pendingReward,
        } as UserStakingInfo);
      }
    };

    if (account && poolId && version) {
      call();
    }
  }, [poolId, account, forceUpdate, version]);

  return [userInfo, update];
}

export function useStakingPoolData(
  poolId: string | undefined,
  version: string | undefined,
): [StakingTokenPoolInfo | undefined, () => void] {
  const [poolData, setPoolData] = useState<StakingTokenPoolInfo | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId) return;
      const data = await getStakingTokenPool(poolId);
      setPoolData(data);
    };

    if (poolId) {
      call();
    }
  }, [poolId, version, forceUpdate]);

  return [poolData, update];
}
