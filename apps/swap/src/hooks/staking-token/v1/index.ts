import { useCallsData } from "@icpswap/hooks";
import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, availableArgsNull, isPrincipal } from "@icpswap/utils";
import { stakingTokenController, stakingToken } from "actor/staking-token-v1";
import type {
  CreateTokenPoolArgs,
  StakingTokenPoolInfo,
  StakingPoolControllerPoolInfo,
  StakingPoolUserInfo,
  StakingPoolCycle,
  StakingPoolGlobalData,
} from "types/staking-token-v1/index";
import type { ActorIdentity, PaginationResult } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

/* token controller */
export async function createStakingTokenPool(args: CreateTokenPoolArgs, identity: ActorIdentity) {
  return resultFormat<string>(await (await stakingTokenController(identity)).createTokenPool(args));
}

export async function getStakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolControllerPoolInfo>>(
    await (
      await stakingTokenController()
    ).findTokenPoolPage(availableArgsNull<bigint>(state), BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenPools(state: bigint | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenPools(state, offset, limit);
    }, [offset, limit, state]),
  );
}

export async function getStakingTokenGlobalData() {
  return resultFormat<StakingPoolGlobalData>(await (await stakingTokenController()).getTokenPoolsGlobalData()).data;
}

export function useStakingTokenGlobalData(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getStakingTokenGlobalData();
    }, []),
    reload,
  );
}

export async function getStakingPoolFromController(canisterId: string) {
  return resultFormat<StakingPoolControllerPoolInfo>(
    await (await stakingTokenController()).getPoolInfo(Principal.fromText(canisterId)),
  ).data;
}

export function useStakingPoolInfoFromController(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolFromController(canisterId);
    }, [canisterId]),
  );
}

/* token pool */
export async function getStakingTokenPool(canisterId: string) {
  return resultFormat<StakingTokenPoolInfo>(await (await stakingToken(canisterId)).getPoolInfo()).data;
}

export function useStakingTokenPool(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingTokenPool(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getStakingTokenUserInfo(canisterId: string, account: string | Principal) {
  return resultFormat<StakingPoolUserInfo>(
    await (
      await stakingToken(canisterId)
    ).getUserInfo(isPrincipal(account) ? { principal: account } : { address: account }),
  ).data;
}

export function useStakingTokenUserInfo(
  canisterId: string | undefined,
  account: string | Principal | undefined,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !account) return undefined;
      return await getStakingTokenUserInfo(canisterId, account);
    }, [canisterId, account]),
    reload,
  );
}

export async function getStakingTokenAllUserInfo(canisterId: string, offset: number, limit: number) {
  return resultFormat<StakingPoolUserInfo>(
    await (await stakingToken(canisterId)).findAllUserInfo(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingTokenAllUserInfo(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingTokenAllUserInfo(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
    reload,
  );
}

export async function getStakingTokenCycles(canisterId: string) {
  return resultFormat<StakingPoolCycle>(await (await stakingToken(canisterId)).getCycleInfo()).data;
}

export function useStakingTokenCycles(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingTokenCycles(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function stakingTokenClaim(canisterId: string, identity: ActorIdentity) {
  return resultFormat<string>(await (await stakingToken(canisterId, identity)).claim());
}

export async function stakingTokenDeposit(canisterId: string, identity: ActorIdentity) {
  return resultFormat<string>(await (await stakingToken(canisterId, identity)).deposit());
}

export async function stakingTokenDepositFrom(canisterId: string, identity: ActorIdentity, amount: bigint) {
  return resultFormat<string>(await (await stakingToken(canisterId, identity)).depositFrom(amount));
}

export async function stakingTokenHarvest(canisterId: string, identity: ActorIdentity) {
  return resultFormat<bigint>(await (await stakingToken(canisterId, identity)).harvest());
}

export async function stakingTokenWithdraw(canisterId: string, identity: ActorIdentity, amount: bigint) {
  return resultFormat<string>(await (await stakingToken(canisterId, identity)).withdraw(amount));
}

// /*  storage */
// export async function getStakingTokenTransactions(canisterId: string, offset: number, limit: number) {
//   return resultFormat<PaginationResult<StakingPoolTransaction>>(
//     await (await stakingTokenStorage(canisterId)).getTrans(BigInt(offset), BigInt(limit)),
//   ).data;
// }

// export function useStakingTokenTransactions(
//   canisterId: string | undefined,
//   offset: number,
//   limit: number,
//   reload?: boolean,
// ) {
//   return useCallsData(
//     useCallback(async () => {
//       if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
//       return await getStakingTokenTransactions(canisterId, offset, limit);
//     }, [canisterId, offset, limit]),
//     reload,
//   );
// }

// export async function getStakingTokenClaimTransactions(canisterId: string, offset: number, limit: number) {
//   return resultFormat<PaginationResult<StakingPoolTransaction>>(
//     await (await stakingTokenStorage(canisterId)).getRewardTrans(BigInt(offset), BigInt(limit)),
//   ).data;
// }

// export function useStakingTokenClaimTransactions(
//   canisterId: string | undefined,
//   offset: number,
//   limit: number,
//   reload?: boolean,
// ) {
//   return useCallsData(
//     useCallback(async () => {
//       if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
//       return await getStakingTokenClaimTransactions(canisterId!, offset, limit);
//     }, [canisterId, offset, limit]),
//     reload,
//   );
// }
