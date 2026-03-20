import { resultFormat, optionalArg, isBigIntMemo } from "@icpswap/utils";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { icrc2 } from "@icpswap/actor";
import { ICRC2 } from "@icpswap/candid";
import {
  BaseTokenAdapter,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  GetFeeRequest,
  TransactionRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  ActualReceivedByTransferRequest,
} from "./BaseTokenAdapter";
import { TokenHolder } from "./types";
import { icrc1Adapter } from "./ICRC1";

export class ICRC2Adapter extends BaseTokenAdapter<ICRC2> {
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
      return await icrc1Adapter.balance({ canisterId, params });
    }

    return resultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.principal) throw Error("no user principal address");
    if (isBigIntMemo(params.memo)) throw Error("Can't support bigint (memo)");

    return await icrc1Adapter.transfer({
      canisterId,
      identity,
      params,
    });
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    return await icrc1Adapter.getFee({ canisterId });
  }

  public async setFee() {
    return resultFormat<boolean>({ err: "no setFee" });
  }

  public async setFeeTo() {
    return resultFormat<boolean>({ err: "no setFeeTo" });
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    return await icrc1Adapter.transactions({ canisterId, params });
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    return resultFormat<boolean>(
      await (
        await this.actor(canisterId, identity)
      ).icrc2_approve({
        spender: {
          owner: params.spender,
          subaccount: optionalArg<number[]>(params.spenderSub ? params.spenderSub : undefined),
        },
        fee: optionalArg<bigint>(params.fee),
        created_at_time: [],
        amount: params.allowance,
        memo: [],
        expected_allowance: optionalArg<bigint>(params.expected_allowance),
        expires_at: optionalArg<bigint>(params.expires_at),
        from_subaccount: optionalArg<number[]>(params.subaccount ? params.subaccount : undefined),
      }),
    );
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    if (!params.owner.principal) throw Error("no principal");

    const result = await (
      await this.actor(canisterId)
    ).icrc2_allowance({
      spender: {
        owner: params.spender,
        subaccount: optionalArg<Array<number>>(params.spenderSub ? params.spenderSub : undefined),
      },
      account: {
        owner: params.owner.principal,
        subaccount: optionalArg<Array<number>>(params.subaccount ? params.subaccount : undefined),
      },
    });

    return resultFormat<bigint>(result.allowance);
  }

  public async metadata({ canisterId }: MetadataRequest) {
    return await icrc1Adapter.metadata({ canisterId });
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async getMintingAccount({ canisterId }: { canisterId: string }) {
    return await icrc1Adapter.getMintingAccount({ canisterId });
  }
}

export const icrc2Adapter = new ICRC2Adapter({
  actor: icrc2,
});
