// import { ContractTransaction } from "@ethersproject/contracts";
import { useCallsData } from "@icpswap/hooks";
// import { MaxUint256, ERC20Token } from "@icpswap/swap-sdk";
import { ERC20Token } from "@icpswap/swap-sdk";
import { useERC20Contract } from "hooks/web3/useContract";
import { useCallback, useMemo } from "react";
// import { ApproveTransactionInfo, TransactionType } from "store/transactions/types";
// import { UserRejectedRequestError } from "utils/web3/errors";
// import { didUserReject } from "utils/web3/swapErrorToUserReadableMessage";

// const MAX_ALLOWANCE = MaxUint256.toString();

export interface UseTokenAllowanceArgs {
  tokenAllowance?: string;
  isSyncing: boolean;
}

export function useERC20TokenAllowance(
  token?: ERC20Token,
  owner?: string,
  spender?: string,
  reload?: number | boolean,
): UseTokenAllowanceArgs {
  const contract = useERC20Contract(token?.address, false);

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the tokenAllowance is marked isSyncing upon approval and updated upon being synced.
  // const [blocksPerFetch, setBlocksPerFetch] = useState<1>();
  const { result, loading } = useCallsData<string>(
    useCallback(async () => {
      if (!owner || !spender) return undefined;
      const allowance = await contract?.allowance(owner, spender);
      return allowance?.toString();
    }, [owner, spender, contract]),
    reload,
  );

  // const { result, syncing: isSyncing } = useSingleCallResult(contract, "allowance", inputs, { blocksPerFetch }) as {
  //   result?: Awaited<ReturnType<NonNullable<typeof contract>["allowance"]>>;
  //   syncing: boolean;
  // };

  const rawAmount = result?.toString(); // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(() => (token && rawAmount ? rawAmount : undefined), [token, rawAmount]);

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing: loading }), [allowance, loading]);
}

// export function useUpdateTokenAllowance(amount: CurrencyAmount<Token> | undefined, spender: string) {
//   const contract = useERC20Contract(amount?.currency.address);

//   return useCallback(async () => {
//     try {
//       if (!amount || !contract || !spender) return;

//       const allowance = amount.equalTo(0) ? "0" : MAX_ALLOWANCE;

//       try {
//         const response = await contract.approve(spender, allowance);

//         return {
//           response,
//           info: {
//             type: TransactionType.APPROVAL,
//             tokenAddress: contract.address,
//             spender,
//             amount: allowance,
//           },
//         };
//       } catch (error) {
//         if (didUserReject(error)) {
//           const symbol = amount?.currency.symbol ?? "Token";
//           throw new UserRejectedRequestError(`${symbol} token allowance failed: User rejected`);
//         } else {
//           throw error;
//         }
//       }
//     } catch (error: unknown) {
//       if (error instanceof UserRejectedRequestError) {
//         throw error;
//       } else {
//         const symbol = amount?.currency.symbol ?? "Token";
//         throw new Error(`${symbol} token allowance failed: ${error instanceof Error ? error.message : error}`);
//       }
//     }
//   }, [amount, contract, spender]);
// }

// export function useRevokeTokenAllowance(token: Token | undefined, spender: string) {
//   const amount = useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, 0) : undefined), [token]);

//   return useUpdateTokenAllowance(amount, spender);
// }
