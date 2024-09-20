import { useCallsData } from "@icpswap/hooks";
import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ckBTCMinterActor } from "actor/ckBTC";
import { Principal } from "@dfinity/principal";
import { UtxoStatus } from "candid/ckBTCMint";
import {
  useUserBTCDepositAddress,
  useUpdateUserBTCDepositAddress,
  useUserBTCWithdrawAddress,
  useUpdateUserBTCWithdrawAddress,
  useUserTxs,
  useUpdateUserTx,
} from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { TxState } from "types/ckBTC";
import { Null } from "@icpswap/types";

import { useIntervalFetch } from "../useIntervalFetch";

export function isEndedState(state: TxState) {
  return !(state !== "Confirmed" && state !== "AmountTooLow");
}

export function useBtcDepositAddress(principal: string | undefined, subaccount?: Uint8Array) {
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
          await ckBTCMinterActor(true)
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
    return resultFormat<Array<UtxoStatus>>(
      await (
        await ckBTCMinterActor(true)
      ).update_balance({
        owner: availableArgsNull<Principal>(Principal.fromText(principal)),
        subaccount: availableArgsNull<Uint8Array>(subaccount),
      }),
    );
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
        await (await ckBTCMinterActor(true)).get_withdrawal_account(),
      ).data;

      if (address) {
        updateUserWithdrawAddress(principal, address.owner, address.subaccount);
      }

      return address;
    }, [storeAddress?.owner, principal]),
  );
}

type VOut = {
  scriptpubkey: string;
  scriptpubkey_address: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  value: number;
};

type VIn = {
  txid: string;
  vout: number;
  prevout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: 200000;
  };
  scriptsig: string;
  scriptsig_asm: string;
};

export type BTCTx = {
  fee: number;
  locktime: number;
  size: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  version: number;
  txid: string;
  weight: number;
  vout: VOut[];
  vin: VIn[];
};

export function useBtcTransactions(address: string | undefined | null, refresh?: number | boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!address) return undefined;

      try {
        const result = await fetch(`https://blockstream.info/api/address/${address}/txs`);
        return (await result.json()) as BTCTx[];
      } catch (error) {
        return undefined;
      }
    }, [address]),
    refresh,
  );
}

export function useBtcTransaction(tx: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!tx) return undefined;

      try {
        const result = await fetch(`https://blockchain.info/rawtx/${tx}`);
        const json = await result.json();
        return json as BTCTx[];
      } catch (error) {
        return undefined;
      }
    }, [tx]),
    reload,
  );
}

export function useFetchUserTxStates() {
  const principal = useAccountPrincipalString();
  const txs = useUserTxs(principal);
  const updateUserTx = useUpdateUserTx();

  useEffect(() => {
    async function call() {
      if (txs && txs.length && !!principal) {
        for (let i = 0; i < txs.length; i++) {
          const block_index = BigInt(txs[i].block_index);
          const { state } = txs[i];
          if (!isEndedState(state)) {
            const res = await (await ckBTCMinterActor()).retrieve_btc_status({ block_index });
            updateUserTx(principal, block_index, res, undefined);
          }
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [txs, principal]);
}

export function useBtcCurrentBlock() {
  const call = async () => {
    try {
      const result = await fetch(`https://blockchain.info/q/getblockcount`);
      return (await result.json()) as number;
    } catch (error) {
      return undefined;
    }
  };

  const block = useIntervalFetch(call, undefined, 30000);

  return useMemo(() => block, [block]);
}
