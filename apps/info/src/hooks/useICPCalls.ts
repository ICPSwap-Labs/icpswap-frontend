import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";

const ROSETTA_API__BASE = "https://rosetta-api.internetcomputer.org";
const INTERNET_COMPUTER_BASE = "https://ic-api.internetcomputer.org/api/v3";

export type ICPTransactionOperation = {
  account: {
    address: string;
  };
  amount: {
    currency: {
      decimals: number;
      symbol: string;
    };
    value: string;
  };
  operation_identifier: {
    index: number;
  };
  status: string;
  type: string;
};

export type ICPTransaction = {
  block_identifier: {
    hash: string;
    index: number;
  };
  transaction: {
    metadata: {
      block_height: number;
      memo: number;
      timestamp: number;
    };
    operations: ICPTransactionOperation[];
    transaction_identifier: {
      hash: string;
    };
  };
};
export interface ICPTransactions {
  total_count: number;
  transactions: ICPTransaction[];
}

export async function getICPTransactions(address: string) {
  const fetch_result = await fetch(`${ROSETTA_API__BASE}/search/transactions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      network_identifier: {
        blockchain: "Internet Computer",
        network: "00000000000000020101",
      },
      account_identifier: {
        address,
      },
    }),
  }).catch(() => undefined);

  if (!fetch_result) return undefined;

  const result = (await fetch_result.json()) as ICPTransactions;

  return result;
}

export function useICPTransactions(address: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!address) return undefined;
      return await getICPTransactions(address);
    }, [address]),
  );
}

export function useICPBlocksCall() {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch(`${INTERNET_COMPUTER_BASE}/metrics/block-rate`).catch(() => undefined);

      if (!fetch_result) return undefined;

      const result = (await fetch_result.json()) as {
        block_rate: [number, number][];
      };

      return {
        blocks: result.block_rate[0][0],
        secondBlocks: result.block_rate[0][1],
      };
    }, []),
  );
}
