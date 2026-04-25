import { Principal } from "@icp-sdk/core/principal";
import { passCodeManager } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function usePCMMetadata(): UseQueryResult<
  | {
      passcodePrice: bigint;
      tokenCid: Principal;
      factoryCid: Principal;
    }
  | undefined,
  Error
> {
  return useQuery({
    queryKey: ["usePCMMetadata"],
    queryFn: async () => {
      return resultFormat<{
        passcodePrice: bigint;
        tokenCid: Principal;
        factoryCid: Principal;
      }>(await (await passCodeManager()).metadata()).data;
    },
  });
}

export async function requestPassCode(token0: Principal, token1: Principal, fee: bigint) {
  const result = await (await passCodeManager(true)).requestPasscode(token0, token1, fee);

  return resultFormat<string>(result);
}

export async function withdrawPCMBalance(amount: bigint, fee: bigint | number) {
  const result = await (await passCodeManager(true)).withdraw({ fee: BigInt(fee), amount });
  return resultFormat<bigint>(result);
}

export async function destroyPassCode(token0: string, token1: string, fee: bigint) {
  const result = await (await passCodeManager(true)).destoryPasscode(
    Principal.fromText(token0),
    Principal.fromText(token1),
    fee,
  );

  return resultFormat<string>(result);
}

export function useUserPCMBalance(
  principal: Principal | undefined,
  reload?: number,
): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useUserPCMBalance", principal?.toString(), reload],
    queryFn: async () => {
      if (!principal) return undefined;
      return resultFormat<bigint>(await (await passCodeManager()).balanceOf(principal)).data;
    },
    enabled: !!principal,
  });
}
