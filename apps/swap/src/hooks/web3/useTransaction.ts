import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";

export function useIntervalTransaction(hash: string | undefined) {
  const { provider } = useWeb3React();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

  const getTransaction = useCallback(async () => {
    if (isUndefinedOrNull(hash) || isUndefinedOrNull(provider)) return undefined;
    return await provider.getTransaction(hash);
  }, [provider, hash]);

  const intervalTransaction = useIntervalFetch<TransactionResponse>(getTransaction);

  useEffect(() => {
    if (intervalTransaction) {
      setTransaction(intervalTransaction);
    }
  }, [intervalTransaction]);

  return useMemo(() => transaction, [transaction]);
}

export function useIntervalMultipleTransactions(hash: string | undefined) {
  const { provider } = useWeb3React();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

  const getTransaction = useCallback(async () => {
    if (isUndefinedOrNull(hash) || isUndefinedOrNull(provider)) return undefined;
    return await provider.getTransaction(hash);
  }, [provider, hash]);

  const intervalTransaction = useIntervalFetch<TransactionResponse>(getTransaction);

  useEffect(() => {
    if (intervalTransaction) {
      setTransaction(intervalTransaction);
    }
  }, [intervalTransaction]);

  return useMemo(() => transaction, [transaction]);
}

export function useTransaction(hash: string | undefined) {
  const { provider } = useWeb3React();

  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(hash) || isUndefinedOrNull(provider)) return undefined;
      return await provider.getTransaction(hash);
    }, [provider, hash]),
  );
}
