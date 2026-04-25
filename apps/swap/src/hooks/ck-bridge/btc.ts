import { Principal } from "@icp-sdk/core/principal";
import { ckBtcMinter } from "@icpswap/actor";
import { isUndefinedOrNull, optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { BITCOIN_MINT_REFRESH } from "constants/chain-key";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useBitcoinDissolveTxs } from "store/wallet/hooks";
import { useBitcoinAllTxResponse } from "store/web3/hooks";
import type { BitcoinTransaction, BitcoinTxResponse } from "types/ckBTC";
import {
  isBitcoinTransactionUnFinalized,
  isBitcoinTxUnFinalized,
  isBitcoinTxUnFinalizedByBlock,
  isBtcMintTransaction,
} from "utils/web3/ck-bridge";

const bitcoinBlockNumberAtom = atom<number | undefined>(undefined);

export function useFetchBitcoinBlockNumber() {
  const [, setBitcoinBlockNumber] = useAtom(bitcoinBlockNumberAtom);

  useQuery({
    queryKey: ["bitcoinBlocknumber"],
    queryFn: async () => {
      let blockNumber: number | undefined;

      try {
        const result = await fetch(`https://blockchain.info/q/getblockcount`);
        blockNumber = (await result.json()) as number;
      } catch (_error) {}

      setBitcoinBlockNumber(blockNumber);

      return blockNumber;
    },
    refetchInterval: 10_000,
  });
}

export function useBitcoinBlockNumber() {
  return useAtomValue(bitcoinBlockNumberAtom);
}

export function useBtcUnconfirmedDissolveHashes() {
  const dissolveTxs = useBitcoinDissolveTxs();
  const principal = useAccountPrincipalString();
  const block = useBitcoinBlockNumber();
  const allBitcoinTxResponse = useBitcoinAllTxResponse();

  const unconfirmedHashes = useMemo(() => {
    if (
      isUndefinedOrNull(dissolveTxs) ||
      isUndefinedOrNull(principal) ||
      isUndefinedOrNull(block) ||
      isUndefinedOrNull(allBitcoinTxResponse)
    )
      return [];

    return dissolveTxs
      .filter((tx) => {
        if (!tx.txid) return false;
        const allTxResponse = allBitcoinTxResponse[principal];
        const txResponse = allTxResponse?.[tx.txid];
        if (!txResponse) return true;
        return isBitcoinTxUnFinalized(txResponse, block);
      })
      .map((tx) => tx.txid) as string[];
  }, [dissolveTxs, allBitcoinTxResponse, block, principal]);

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- stringify array dependency to stop hook loop
  return useMemo(() => unconfirmedHashes, [JSON.stringify(unconfirmedHashes)]);
}

export function useBtcDepositAddress(subaccount?: Uint8Array) {
  const principal = useAccountPrincipalString();
  const subaccountKey = subaccount?.length ? [...subaccount].join(",") : "";

  const { data: address, isPending: loading } = useQuery({
    queryKey: ["btcDepositAddress", principal, subaccountKey],
    queryFn: async () => {
      if (!principal) return null;
      return resultFormat<string>(
        await (await ckBtcMinter(true)).get_btc_address({
          owner: optionalArg(Principal.fromText(principal)),
          subaccount: optionalArg<Uint8Array>(subaccount),
        }),
      ).data;
    },
    enabled: !!principal,
  });

  return useMemo(() => ({ result: address ?? null, loading }), [address, loading]);
}

export function useRefreshBtcBalanceCallback() {
  return useCallback(async (principal: string, subaccount?: Uint8Array) => {
    return await (await ckBtcMinter(true)).update_balance({
      owner: optionalArg<Principal>(Principal.fromText(principal)),
      subaccount: optionalArg<Uint8Array>(subaccount),
    });
  }, []);
}

export function useBtcWithdrawAddress(): UseQueryResult<
  { owner: Principal; subaccount: [] | Uint8Array[] } | undefined,
  Error
> {
  const principal = useAccountPrincipalString();

  return useQuery({
    queryKey: ["useBtcWithdrawAddress", principal],
    queryFn: async () => {
      if (!principal) return undefined;

      const address = resultFormat<{ owner: Principal; subaccount: [] | Uint8Array[] }>(
        await (await ckBtcMinter(true)).get_withdrawal_account(),
      ).data;

      return address;
    },
    enabled: !!principal,
  });
}

export async function getBitcoinTransactions(address: string) {
  try {
    const result = await fetch(`https://blockstream.info/api/address/${address}/txs`);
    const jsonResult = (await result.json()) as BitcoinTransaction[] | { error: string; message: string };

    if ("error" in jsonResult) return undefined;

    return jsonResult;
  } catch (_error) {
    return undefined;
  }
}

export function useBtcTransactions(
  address: string | undefined | null,
  refresh?: number | boolean,
): UseQueryResult<BitcoinTransaction[] | undefined, Error> {
  return useQuery({
    queryKey: ["useBtcTransactions", address, refresh],
    queryFn: async () => {
      if (!address) return undefined;
      return await getBitcoinTransactions(address);
    },
    enabled: !!address,
  });
}

export function useBtcMintTransactions(): { result: BitcoinTransaction[] | undefined; loading: boolean } {
  const { result: address } = useBtcDepositAddress();
  const [refresh] = useRefreshTriggerManager(BITCOIN_MINT_REFRESH);
  const { data: allTransactions, isLoading: loading } = useBtcTransactions(address, refresh);

  const mintTransactions = useMemo(() => {
    if (isUndefinedOrNull(address) || isUndefinedOrNull(allTransactions)) return undefined;
    return allTransactions.filter((ele) => !isBtcMintTransaction(ele, address));
  }, [allTransactions, address]);

  return useMemo(() => ({ result: mintTransactions, loading }), [mintTransactions, loading]);
}

export function useBtcMintUnconfirmedTransactions() {
  const { result: transactions } = useBtcMintTransactions();
  const block = useBitcoinBlockNumber();

  return useMemo(() => {
    if (isUndefinedOrNull(transactions) || isUndefinedOrNull(block)) return [];
    return transactions.filter((transaction) => isBitcoinTransactionUnFinalized(transaction, block));
  }, [transactions, block]);
}

export async function getBtcTransactionResponse(tx: string) {
  try {
    const result = await fetch(`https://blockchain.info/rawtx/${tx}`);
    const json = await result.json();
    return json as BitcoinTxResponse;
  } catch (_error) {
    return undefined;
  }
}

export function useBtcTransactionResponse(
  tx: string | undefined,
  reload?: boolean,
): UseQueryResult<BitcoinTxResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useBtcTransactionResponse", tx, reload],
    queryFn: async () => {
      if (!tx) return undefined;
      return await getBtcTransactionResponse(tx);
    },
    enabled: !!tx,
  });
}

export function useBitcoinUnFinalizedMintHashes() {
  const { result: mintTransactions } = useBtcMintTransactions();
  const block = useBitcoinBlockNumber();

  const unFinalizedHashes = useMemo(() => {
    if (isUndefinedOrNull(mintTransactions) || isUndefinedOrNull(block)) return [];

    return mintTransactions
      .filter((tx) => {
        return isBitcoinTxUnFinalizedByBlock(tx.status.block_height, block);
      })
      .map((tx) => tx.txid);
  }, [mintTransactions, block]);

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- stringify array dependency to stop hook loop
  return useMemo(() => unFinalizedHashes, [JSON.stringify(unFinalizedHashes)]);
}

export function useBitcoinConfirmations(block: number | null | undefined) {
  const currentBlock = useBitcoinBlockNumber();

  return useMemo(() => {
    return currentBlock && block ? Number(currentBlock) - block : undefined;
  }, [currentBlock, block]);
}
