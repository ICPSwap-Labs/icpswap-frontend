import { resultFormat, optionalArg, isBigIntMemo } from "@icpswap/utils";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { icrc1, icrcArchive } from "@icpswap/actor";
import { ICRC1_SERVICE, MetadataValue, GetTransactionsResponse, ArchivedTransaction } from "@icpswap/candid";

import { Transaction, Metadata } from "./types";
import {
  BaseTokenAdapter,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  GetFeeRequest,
  TransactionRequest,
  MetadataRequest,
  ActualReceivedByTransferRequest,
} from "./BaseTokenAdapter";
import { icrcTransactionFormat } from "./utils";

const byTimestamp = (a: { timestamp: bigint }, b: { timestamp: bigint }) => Number(a.timestamp - b.timestamp);

export class ICRC1Adapter extends BaseTokenAdapter<ICRC1_SERVICE> {
  public async supply({ canisterId }: SupplyRequest) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).icrc1_total_supply());
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (params.user.principal) {
      return resultFormat<bigint>(
        await (
          await this.actor(canisterId)
        ).icrc1_balance_of({
          owner: params.user.principal,
          subaccount: optionalArg<Array<number>>(params.subaccount ? params.subaccount : undefined),
        }),
      );
    }

    return resultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.principal) throw Error("no user principal address");
    if (isBigIntMemo(params.memo)) throw Error("Can't support bigint (memo)");

    const result = await (
      await this.actor(canisterId, identity)
    ).icrc1_transfer({
      to: {
        owner: params.to.principal,
        subaccount: optionalArg<Array<number>>(params.subaccount ? params.subaccount : undefined),
      },
      memo: optionalArg<number[]>(params.memo),
      amount: params.amount,
      created_at_time: optionalArg<bigint>(params.create_at_time),
      from_subaccount: optionalArg<Array<number>>(params.from_sub_account ? params.from_sub_account : undefined),
      fee: optionalArg<bigint>(params.fee),
    });

    return resultFormat<bigint>(result);
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).icrc1_fee());
  }

  public async setFee() {
    return resultFormat<boolean>({ err: "no setFee" });
  }

  public async setFeeTo() {
    return resultFormat<boolean>({ err: "no setFeeTo" });
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    if (params.offset === undefined || params.limit === undefined) throw Error("no offset or limit");

    // To get the total length
    const init_result = resultFormat<GetTransactionsResponse>(
      await (await this.actor(canisterId)).get_transactions({ start: BigInt(0), length: BigInt(10) }),
    ).data;

    if (init_result) {
      const { log_length } = init_result;

      // The start index of the transactions
      let start_index = Number(log_length) - 1 - params.offset - params.limit;

      if (start_index < 0) start_index = 0;

      const _result = resultFormat<GetTransactionsResponse>(
        await (
          await this.actor(canisterId)
        ).get_transactions({
          start: BigInt(start_index),
          length: BigInt(params.limit),
        }),
      ).data;

      if (_result) {
        const { archived_transactions, transactions: token_canister_transactions } = _result;

        let archivedTransactions: ArchivedTransaction[] = [];

        if (archived_transactions.length > 0) {
          archivedTransactions = (
            await Promise.all(
              archived_transactions.map((ele) =>
                icrcArchive(ele.callback[0].toString()).then((archive) =>
                  archive.get_transactions({ start: ele.start, length: ele.length }),
                ),
              ),
            )
          )
            .flatMap((r) => r.transactions)
            .sort(byTimestamp);
        }

        const transactions = archivedTransactions
          .concat(token_canister_transactions)
          .sort(byTimestamp)
          .map((ele, index) =>
            // @ts-ignore
            icrcTransactionFormat(ele, BigInt(start_index) + BigInt(index)),
          );

        return resultFormat<PaginationResult<Transaction>>({
          content: transactions.reverse(),
          totalElements: log_length,
          offset: BigInt(params.offset),
          limit: BigInt(params.limit),
        });
      }
    }

    return resultFormat<PaginationResult<Transaction>>(undefined);
  }

  public async approve() {
    return resultFormat<boolean>({ err: "no approve" });
  }

  public async allowance() {
    return resultFormat<bigint>({ err: "no allowance" });
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const metadata = resultFormat<Array<[string, MetadataValue]>>(
      await (await this.actor(canisterId)).icrc1_metadata(),
    ).data;

    if (!metadata) {
      return { status: ResultStatus.ERROR, data: undefined, message: "" };
    }

    const fields: Record<string, string | bigint> = {};
    for (const [key, val] of metadata) {
      if (key.startsWith("icrc1:")) {
        const v = val as { Text?: string; Nat?: bigint };
        fields[key] = v.Text ?? v.Nat ?? "";
      }
    }

    return {
      status: ResultStatus.OK,
      data: {
        name: (fields["icrc1:name"] as string) ?? "",
        symbol: (fields["icrc1:symbol"] as string) ?? "",
        decimals: Number(fields["icrc1:decimals"] ?? 0),
        fee: (fields["icrc1:fee"] as bigint) ?? BigInt(0),
        logo: (fields["icrc1:logo"] as string) ?? "",
      } as Metadata,
      message: "",
    };
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async getMintingAccount({ canisterId }: { canisterId: string }) {
    const result = (await (await this.actor(canisterId)).icrc1_minting_account())[0];
    return resultFormat<{ owner: string; sub: number[] | undefined }>(
      result
        ? { owner: result.owner.toString(), sub: result.subaccount[0] ? [...result.subaccount[0]] : undefined }
        : undefined,
    );
  }
}

export const icrc1Adapter = new ICRC1Adapter({
  actor: icrc1,
});
