import { AccountIdentifier, SubAccount } from "@icpswap/dfinity";
import type { ICRCTransaction } from "@icpswap/candid";
import { enumToString, isOkSubAccount } from "@icpswap/utils";
import type { Transaction as TokenTransaction } from "./types";

function getFirstMemo(tx: ICRCTransaction) {
  const m = tx.transfer[0]?.memo ?? tx.burn[0]?.memo ?? tx.mint[0]?.memo;
  return m?.length ? m : undefined;
}

export function icrcTransactionFormat(transaction: ICRCTransaction, index: bigint) {
  const memo = getFirstMemo(transaction);

  const from_owner = transaction.transfer[0]?.from.owner ?? transaction.burn[0]?.from.owner;
  const _from_sub = transaction.transfer[0]?.from.subaccount[0] ?? transaction.burn[0]?.from.subaccount[0];
  const to_owner = transaction.transfer[0]?.to.owner ?? transaction.mint[0]?.to.owner;
  const _to_sub = transaction.transfer[0]?.to.subaccount[0] ?? transaction.mint[0]?.to.subaccount[0];

  const from_sub = _from_sub ? SubAccount.fromBytes(Uint8Array.from(_from_sub)) : undefined;
  const from_account = from_owner
    ? AccountIdentifier.fromPrincipal({
        principal: from_owner,
        subAccount: isOkSubAccount(from_sub) ? from_sub : undefined,
      })
    : undefined;

  const to_sub = _to_sub ? SubAccount.fromBytes(Uint8Array.from(_to_sub)) : undefined;
  const to_account = to_owner
    ? AccountIdentifier.fromPrincipal({
        principal: to_owner,
        subAccount: isOkSubAccount(to_sub) ? to_sub : undefined,
      })
    : undefined;

  const feeArray = transaction.transfer[0]?.fee;

  return {
    timestamp: transaction.timestamp,
    hash: "",
    fee: feeArray ? feeArray[0] : undefined,
    from_owner: from_owner?.toString() ?? "",
    from_sub: _from_sub,
    from_account: from_account?.toHex() ?? "",
    to_owner: to_owner?.toString() ?? "",
    to_sub: _to_sub,
    to_account: to_account?.toHex() ?? "",
    transType: enumToString(
      transaction.transfer[0]
        ? { Transfer: null }
        : transaction.burn[0]
          ? { Burn: null }
          : transaction.mint[0]
            ? { Mint: null }
            : { Approve: null },
    ),
    amount: transaction.transfer[0]?.amount ?? transaction.burn[0]?.amount ?? transaction.mint[0]?.amount,
    index,
    memo: memo ? [...memo[0]] : [],
    status: "",
  } as TokenTransaction;
}
