import { Principal } from "@icp-sdk/core/principal";
import { dogeMinter } from "@icpswap/actor";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull, optionalArg, resultFormat } from "@icpswap/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DogeUtxo, RetrieveDogeStatus } from "@icpswap/candid";

export async function getDogeAddress(principal: string) {
  const result = await (
    await dogeMinter()
  ).get_doge_address({ owner: optionalArg(Principal.fromText(principal)), subaccount: optionalArg(null) });

  return resultFormat<string>(result).data;
}

export function useDogeAddress(principal: string | Null) {
  return useQuery({
    queryKey: ["dogeAddress", principal],
    queryFn: async () => {
      if (!principal) return null;
      return await getDogeAddress(principal);
    },
  });
}

export async function updateDogeBalance(principal: string) {
  return await (
    await dogeMinter(true)
  ).update_balance({ owner: optionalArg(Principal.fromText(principal)), subaccount: optionalArg(null) });
}

export async function getDogeKnownUtxos(principal: string): Promise<Array<DogeUtxo> | undefined> {
  const res = await (
    await dogeMinter()
  ).get_known_utxos({ owner: optionalArg(Principal.fromText(principal)), subaccount: optionalArg(null) });

  return resultFormat<Array<DogeUtxo>>(res).data;
}

export function useDogeKnownUtxos(
  principal: string | undefined,
  refetchInterval?: number,
): UseQueryResult<DogeUtxo[], Error> {
  return useQuery({
    queryKey: ["dogeKnownUtxos", principal],
    queryFn: () => {
      if (isUndefinedOrNull(principal)) return undefined;
      return getDogeKnownUtxos(principal);
    },
    refetchInterval,
  });
}

export async function getDogeMinterInfo() {
  const result = await (await dogeMinter()).get_minter_info();

  return resultFormat<{
    retrieve_doge_min_amount: bigint;
    min_confirmations: number;
    deposit_doge_min_amount: bigint;
  }>(result).data;
}

export function useDogeMinterInfo(): UseQueryResult<
  { retrieve_doge_min_amount: bigint; min_confirmations: number; deposit_doge_min_amount: bigint },
  Error
> {
  return useQuery({
    queryKey: ["dogeMinterInfo"],
    queryFn: getDogeMinterInfo,
  });
}

export async function retrieveDogeWithApproval({
  address,
  amount,
  from_subaccount,
}: {
  address: string;
  amount: number | string | bigint;
  from_subaccount?: Uint8Array | number[];
}) {
  const result = await (
    await dogeMinter(true)
  ).retrieve_doge_with_approval({ address, amount: BigInt(amount), from_subaccount: optionalArg(from_subaccount) });

  return resultFormat<{ block_index: bigint }>(result);
}

export async function retrieveDogeStatus({ block_index }: { block_index: string | number }) {
  const result = await (await dogeMinter()).retrieve_doge_status({ block_index: BigInt(block_index) });
  return resultFormat<RetrieveDogeStatus>(result);
}

export async function getDogeWithdrawalFee(amount?: bigint | Null) {
  const result = await (await dogeMinter()).estimate_withdrawal_fee({ amount: optionalArg(amount) });
  return resultFormat<{ minter_fee: bigint; dogecoin_fee: bigint }>(result).data;
}

export function useDogeWithdrawalFee(amount?: bigint | Null) {
  return useQuery({ queryKey: ["dogeWithdrawalFee"], queryFn: () => getDogeWithdrawalFee(amount) });
}
