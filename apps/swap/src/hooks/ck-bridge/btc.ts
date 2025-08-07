import { useCallsData } from "@icpswap/hooks";
import { resultFormat, availableArgsNull, isUndefinedOrNull } from "@icpswap/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ckBtcMinter } from "actor/ckBTC";
import { Principal } from "@dfinity/principal";
import {
  useUserBTCDepositAddress,
  useUpdateUserBTCDepositAddress,
  useUserBTCWithdrawAddress,
  useUpdateUserBTCWithdrawAddress,
  useBTCDissolveTxs,
} from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { BitcoinTxResponse, BitcoinTransaction, TxState } from "types/ckBTC";
import { Null } from "@icpswap/types";
import { isBitcoinTransactionUnFinalized, isBitcoinTxUnFinalized, isBtcMintTransaction } from "utils/web3/ck-bridge";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";
import { BTC_MINT_REFRESH } from "constants/ckBTC";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import { useBitcoinAllTxResponse } from "store/web3/hooks";

export function useFetchBitcoinBlockNumber(): number | undefined {
  const { data } = useSwr(
    "bitcoinBlocknumber",
    async () => {
      try {
        const result = await fetch(`https://blockchain.info/q/getblockcount`);
        return (await result.json()) as number;
      } catch (error) {
        return undefined;
      }
    },
    {
      refreshInterval: 30000,
    },
  );

  return data;
}

export function useBitcoinBlockNumber() {
  const { data } = useSWRImmutable<number>("bitcoinBlocknumber");
  return data;
}

export function useBtcUnconfirmedDissolveHashes() {
  const dissolveTxs = useBTCDissolveTxs();
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
      .map((tx) => tx.txid);
  }, [dissolveTxs, allBitcoinTxResponse, block, principal]);

  return useMemo(() => unconfirmedHashes, [JSON.stringify(unconfirmedHashes)]);
}

export function isEndedState(state: TxState) {
  return !(state !== "Confirmed" && state !== "AmountTooLow");
}

export function useBtcDepositAddress(subaccount?: Uint8Array) {
  const principal = useAccountPrincipalString();

  const [address, setAddress] = useState<Null | string>(null);
  const [loading, setLoading] = useState(false);

  const storeUserDepositAddress = useUserBTCDepositAddress(principal);
  const updateUserBTCAddress = useUpdateUserBTCDepositAddress();

  useEffect(() => {
    async function call() {
      if (!principal) return;
      if (storeUserDepositAddress) {
        setAddress(storeUserDepositAddress);
        return;
      }

      setLoading(true);

      const address = resultFormat<string>(
        await (
          await ckBtcMinter(true)
        ).get_btc_address({
          owner: availableArgsNull(Principal.fromText(principal)),
          subaccount: availableArgsNull<Uint8Array>(subaccount),
        }),
      ).data;

      if (address && principal) {
        updateUserBTCAddress(principal, address);
      }

      setAddress(address);
      setLoading(false);
    }

    call();
  }, [principal, subaccount, storeUserDepositAddress]);

  return useMemo(() => ({ result: address, loading }), [address, loading]);
}

export function useRefreshBtcBalanceCallback() {
  return useCallback(async (principal: string, subaccount?: Uint8Array) => {
    return await (
      await ckBtcMinter(true)
    ).update_balance({
      owner: availableArgsNull<Principal>(Principal.fromText(principal)),
      subaccount: availableArgsNull<Uint8Array>(subaccount),
    });
  }, []);
}

export function useBtcWithdrawAddress() {
  const principal = useAccountPrincipalString();
  const storeAddress = useUserBTCWithdrawAddress(principal);
  const updateUserWithdrawAddress = useUpdateUserBTCWithdrawAddress();

  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;

      const address = resultFormat<{ owner: Principal; subaccount: [] | Uint8Array[] }>(
        await (await ckBtcMinter(true)).get_withdrawal_account(),
      ).data;

      if (address) {
        updateUserWithdrawAddress(principal, address.owner, address.subaccount);
      }

      return address;
    }, [storeAddress?.owner, principal]),
  );
}

export function useBtcTransactions(address: string | undefined | null, refresh?: number | boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!address) return undefined;

      try {
        const result = await fetch(`https://blockstream.info/api/address/${address}/txs`);
        const jsonResult = (await result.json()) as BitcoinTransaction[] | { error: string; message: string };

        if ("error" in jsonResult) return undefined;

        return jsonResult;
      } catch (error) {
        return undefined;
      }
    }, [address]),
    refresh,
  );
}

export function useBtcMintTransactions() {
  const { result: address } = useBtcDepositAddress();
  const [refresh] = useRefreshTriggerManager(BTC_MINT_REFRESH);
  const { result: allTransactions, loading } = useBtcTransactions(address, refresh);

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
  } catch (error) {
    return undefined;
  }
}

export function useBtcTransactionResponse(tx: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!tx) return undefined;
      return await getBtcTransactionResponse(tx);
    }, [tx]),
    reload,
  );
}

export function useBtcUnconfirmedMintHashes() {
  const { result: mintTxs } = useBtcMintTransactions();
  const block = useBitcoinBlockNumber();
  const principal = useAccountPrincipalString();
  const allTxResponse = useBitcoinAllTxResponse();

  const unConfirmedHashes = useMemo(() => {
    if (
      isUndefinedOrNull(mintTxs) ||
      isUndefinedOrNull(block) ||
      isUndefinedOrNull(principal) ||
      isUndefinedOrNull(allTxResponse)
    )
      return [];

    return mintTxs
      .filter((tx) => {
        const txResponse = allTxResponse[tx.txid];
        if (!txResponse) return true;
        return isBitcoinTxUnFinalized(txResponse, block);
      })
      .map((tx) => tx.txid);
  }, [mintTxs, block, principal, allTxResponse]);

  return useMemo(() => unConfirmedHashes, [JSON.stringify(unConfirmedHashes)]);
}
