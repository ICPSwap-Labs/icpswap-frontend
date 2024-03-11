import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useIntervalFetch } from "hooks/useIntervalFetch";

export function useTransaction(hash: string | undefined) {
  const { provider } = useWeb3React();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

  const call = useCallback(async () => {
    if (hash && provider) {
      return await provider.getTransaction(hash);
    }

    return undefined;
  }, [provider, hash]);

  const intervalTransaction = useIntervalFetch<TransactionResponse>(call);

  useEffect(() => {
    if (intervalTransaction) {
      setTransaction(intervalTransaction);
    }
  }, [intervalTransaction]);

  return useMemo(() => transaction, [transaction]);
}
