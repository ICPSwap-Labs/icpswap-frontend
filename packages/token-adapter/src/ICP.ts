import { ledgerService } from "@icpswap/actor";
import type { Ledger } from "@icpswap/candid";
import { type ActorIdentity, type PaginationResult, ResultStatus } from "@icpswap/types";
import { isBigIntMemo, optionalArg, resultFormat } from "@icpswap/utils";
import {
  type ActualReceivedByTransferRequest,
  type AllowanceRequest,
  type ApproveRequest,
  type BalanceRequest,
  BaseTokenAdapter,
  type MetadataRequest,
  type TransferRequest,
} from "./BaseTokenAdapter";
import { icrc1Adapter } from "./ICRC1";
import { icrc2Adapter } from "./ICRC2";
import type { Metadata, Transaction } from "./types";

export class ICPAdapter extends BaseTokenAdapter<Ledger> {
  public async supply() {
    const ledger = await this.actor();
    return resultFormat<bigint>(await ledger.icrc1_total_supply());
  }

  public async balance({ params }: BalanceRequest) {
    if (params.user.address) {
      const ledger = await this.actor();
      const balance = await ledger.account_balance({
        account: Array.from(Uint8Array.from(Buffer.from(params.user.address, "hex"))),
      });
      return resultFormat<bigint>(balance.e8s);
    }
    if (params.user.principal) {
      const ledger = await this.actor();
      const balance = await ledger.icrc1_balance_of({
        owner: params.user.principal,
        subaccount: optionalArg<Array<number>>(params.subaccount ?? undefined),
      });
      return resultFormat<bigint>(balance);
    }
    return resultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.address && !params.to.principal) throw Error("No transfer to");

    const ledger = await this.actor(canisterId, identity);

    if (params.to.address) {
      if (params.memo && !isBigIntMemo(params.memo)) throw Error("Only bigint support (memo)");
      const result = await ledger.transfer({
        to: Array.from(Uint8Array.from(Buffer.from(params.to.address, "hex"))),
        memo: (params.memo as bigint) ?? BigInt(0),
        amount: { e8s: params.amount },
        created_at_time: optionalArg<{ timestamp_nanos: bigint }>(
          params.create_at_time ? { timestamp_nanos: params.create_at_time } : undefined,
        ),
        from_subaccount: optionalArg<number[]>(params.from_sub_account),
        fee: { e8s: BigInt(10000) },
      });
      return resultFormat<bigint>(result);
    }
    const result = await ledger.icrc1_transfer({
      to: {
        owner: params.to.principal!,
        subaccount: optionalArg<Array<number>>(params.subaccount ?? undefined),
      },
      memo: typeof params.memo === "bigint" ? [] : optionalArg<number[]>(params.memo),
      amount: params.amount,
      created_at_time: optionalArg<bigint>(params.create_at_time),
      from_subaccount: optionalArg<Array<number>>(params.from_sub_account ?? undefined),
      fee: optionalArg<bigint>(null),
    });
    return resultFormat<bigint>(result);
  }

  public async getFee() {
    const ledger = await this.actor();
    const { transfer_fee } = await ledger.transfer_fee({});
    return resultFormat<bigint>(transfer_fee.e8s);
  }

  public async setFee() {
    return resultFormat<boolean>({ err: "no setFee" });
  }

  public async setFeeTo() {
    return resultFormat<boolean>({ err: "no setFeeTo" });
  }

  public async transactions() {
    return resultFormat<PaginationResult<Transaction>>({
      content: [],
      totalElements: BigInt(0),
      offset: BigInt(0),
      limit: BigInt(10),
    });
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    return icrc2Adapter.approve({ canisterId, params, identity });
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    return icrc2Adapter.allowance({ canisterId, params });
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const ledger = await this.actor(canisterId);
    const [symbolRes, decimalsRes, feeRes] = await Promise.all([
      ledger.symbol(),
      ledger.decimals(),
      ledger.transfer_fee({}),
    ]);
    const fee = resultFormat<bigint>(feeRes.transfer_fee.e8s).data;

    return {
      status: ResultStatus.OK,
      data: {
        decimals: decimalsRes.decimals,
        metadata: [],
        name: "Internet Computer",
        symbol: symbolRes.symbol,
        fee: fee ?? BigInt(1000),
        logo: "",
      } as Metadata,
      message: "",
    };
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async getMintingAccount({ canisterId }: { canisterId: string }) {
    return await icrc1Adapter.getMintingAccount({ canisterId });
  }
}

export const icpAdapter = new ICPAdapter({
  actor: async (_canisterId?: string, identity?: ActorIdentity) => await ledgerService(identity),
});
