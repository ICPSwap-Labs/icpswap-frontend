import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { erc20Minter } from "@icpswap/actor";
import type {
  WithdrawalSearchParameter,
  WithdrawalDetail,
  Erc20MinterInfo,
  Eip1559TransactionPrice,
  Null,
} from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export interface WithdrawErc20TokenArgs {
  ledger_id: Principal;
  recipient: string;
  amount: bigint;
  minter_id: string;
}

export async function withdrawErc20Token({ minter_id, ledger_id, recipient, amount }: WithdrawErc20TokenArgs) {
  return resultFormat<{
    ckerc20_block_index: bigint;
    cketh_block_index: bigint;
  }>(
    await (
      await erc20Minter(minter_id, true)
    ).withdraw_erc20({
      recipient,
      amount,
      ckerc20_ledger_id: ledger_id,
    }),
  );
}

export interface WithdrawErc20TokenStatusArgs {
  params: WithdrawalSearchParameter;
  minter_id: string;
}

export async function withdrawErc20TokenStatus({ minter_id, params }: WithdrawErc20TokenStatusArgs) {
  return resultFormat<WithdrawalDetail[]>(await (await erc20Minter(minter_id)).withdrawal_status(params)).data;
}

export interface UseWithdrawErc20TokenStatusArgs {
  params: WithdrawalSearchParameter | undefined;
  minter_id: string;
  refresh?: boolean | number;
}

export function useWithdrawErc20TokenStatus({ minter_id, params, refresh }: UseWithdrawErc20TokenStatusArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!params) return undefined;
      return await withdrawErc20TokenStatus({ minter_id, params });
    }, [minter_id, params]),
    refresh,
  );
}

export async function getChainKeyMinterInfo(minter_id: string) {
  return resultFormat<Erc20MinterInfo>(await (await erc20Minter(minter_id)).get_minter_info()).data;
}

export function useChainKeyMinterInfo(minter_id: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!minter_id) return undefined;
      return await getChainKeyMinterInfo(minter_id);
    }, [minter_id]),
  );
}

export async function getChainKeyTransactionPrice(minter_id: string) {
  return resultFormat<Eip1559TransactionPrice>(await (await erc20Minter(minter_id)).eip_1559_transaction_price()).data;
}

export function useChainKeyTransactionPrice(minter_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!minter_id) return undefined;
      return await getChainKeyTransactionPrice(minter_id);
    }, [minter_id]),
  );
}
