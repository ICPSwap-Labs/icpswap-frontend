import { resultFormat, availableArgsNull, isBigIntMemo } from "@icpswap/utils";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { icrc1, icrcArchive } from "@icpswap/actor";
import { ICRC1_SERVICE, MetadataValue, GetTransactionsResponse, ArchivedTransaction } from "@icpswap/candid";
import { TokenHolder, Transaction, Metadata } from "./types";
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

export class ICRC1Adapter extends BaseTokenAdapter<ICRC1_SERVICE> {
  public async holders() {
    return {
      status: ResultStatus.OK,
      data: {
        content: [] as TokenHolder[],
        totalElements: 0,
        limit: 10,
        offset: 0,
      } as PaginationResult<TokenHolder>,
      message: "",
    };
  }

  public async totalHolders() {
    return resultFormat<bigint>(undefined);
  }

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
          subaccount: availableArgsNull<Array<number>>(params.subaccount ? params.subaccount : undefined),
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
        subaccount: availableArgsNull<Array<number>>(params.subaccount ? params.subaccount : undefined),
      },
      memo: availableArgsNull<number[]>(params.memo),
      amount: params.amount,
      created_at_time: availableArgsNull<bigint>(params.create_at_time),
      from_subaccount: availableArgsNull<Array<number>>(params.from_sub_account ? params.from_sub_account : undefined),
      fee: availableArgsNull<bigint>(params.fee),
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
              archived_transactions.map(async (ele) => {
                return (
                  await (
                    await icrcArchive(ele.callback[0].toString())
                  ).get_transactions({
                    start: ele.start,
                    length: ele.length,
                  })
                ).transactions;
              }),
            )
          )
            .flat()
            .sort((a, b) => {
              if (a.timestamp < b.timestamp) return -1;
              if (a.timestamp > b.timestamp) return 1;
              return 0;
            });
        }

        const transactions = archivedTransactions
          .concat(token_canister_transactions)
          .sort((a, b) => {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
          })
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
      return {
        status: ResultStatus.ERROR,
        data: undefined,
        message: "",
      };
    }

    let name = "";
    let symbol = "";
    let decimals = BigInt(0);
    let fee = BigInt(0);
    let logo = "";

    for (let i = 0; i < metadata.length; i++) {
      const ele = metadata[i];
      if (ele[0] === "icrc1:name") {
        const val = ele[1] as { Text: string };
        name = val.Text;
      } else if (ele[0] === "icrc1:symbol") {
        const val = ele[1] as { Text: string };
        symbol = val.Text;
      } else if (ele[0] === "icrc1:decimals") {
        const val = ele[1] as { Nat: bigint };
        decimals = val.Nat;
      } else if (ele[0] === "icrc1:fee") {
        const val = ele[1] as { Nat: bigint };
        fee = val.Nat;
      } else if (ele[0] === "icrc1:logo") {
        const val = ele[1] as { Text: string };
        logo = val.Text;
      }
    }

    return {
      status: ResultStatus.OK,
      data: {
        decimals: Number(decimals),
        name,
        symbol,
        fee,
        logo,
      } as Metadata,
      message: "",
    };
  }

  public async setLogo() {
    return resultFormat<boolean>({ err: "no approve" });
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }
}

export const icrc1Adapter = new ICRC1Adapter({
  actor: icrc1,
});
