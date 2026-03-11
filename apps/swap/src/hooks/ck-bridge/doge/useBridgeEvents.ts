import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull, toHexString } from "@icpswap/utils";
import { BitcoinTransactionEvent, DogeTransactionEvent } from "types/web3";
import { ckDoge } from "@icpswap/tokens";
import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { useDogeUnFinalizedDissolveTxs } from "hooks/ck-bridge/doge/useDissolveTxManager";
import { useDogeKnownUtxos } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useDogeBlockNumber } from "hooks/ck-bridge/doge/useBlockNumber";
import { DOGE_MINT_CONFIRMATIONS } from "constants/chain-key";

export function useDogeDissolveEvents() {
  const unFinalizedDissolveTxs = useDogeUnFinalizedDissolveTxs();

  const dissolveEvents: BitcoinTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(unFinalizedDissolveTxs)) return [];

    return unFinalizedDissolveTxs.map((tx) => {
      return {
        hash: tx.txid,
        amount: tx.value,
        type: BridgeType.dissolve,
        chain: BridgeChainType.doge,
        token: ckDoge.address,
      };
    });
  }, [unFinalizedDissolveTxs]);

  return useMemo(() => dissolveEvents, [dissolveEvents]);
}

const UTXOS_FETCH_INTERVAL_TIME_MS = 10_000;

export function useDogeMintEvents() {
  const principal = useAccountPrincipalString();
  const { data: knownUtxos } = useDogeKnownUtxos(principal, UTXOS_FETCH_INTERVAL_TIME_MS);
  const blockNumber = useDogeBlockNumber();

  const unconfirmedTransactions = useMemo(() => {
    if (isUndefinedOrNull(knownUtxos) || isUndefinedOrNull(blockNumber)) return undefined;

    return knownUtxos.filter(
      (element) => !new BigNumber(blockNumber).minus(element.height).isGreaterThan(DOGE_MINT_CONFIRMATIONS),
    );
  }, [knownUtxos, blockNumber]);

  const mintEvents: DogeTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(unconfirmedTransactions)) return [];

    return unconfirmedTransactions.map((tx) => {
      const hash = toHexString([...tx.outpoint.txid].reverse());

      return {
        hash,
        amount: tx.value.toString(),
        type: BridgeType.mint,
        chain: BridgeChainType.doge,
        token: ckDoge.address,
      };
    });
  }, [unconfirmedTransactions]);

  return useMemo(() => mintEvents, [mintEvents]);
}

export const useDogeBridgeEvents = () => {
  const mintEvents = useDogeMintEvents();
  const dissolveEvents = useDogeDissolveEvents();

  return useMemo(() => {
    return [...mintEvents, ...dissolveEvents];
  }, [mintEvents, dissolveEvents]);
};
