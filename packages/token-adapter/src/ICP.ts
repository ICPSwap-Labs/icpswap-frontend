import { resultFormat, availableArgsNull, isBigIntMemo } from "@icpswap/utils";
import { ledgerService } from "@icpswap/actor";
import { Ledger } from "@icpswap/candid";
import { ActorIdentity, PaginationResult, ResultStatus } from "@icpswap/types";
import { TokenHolder, Transaction, Metadata } from "./types";
import {
  BaseTokenAdapter,
  BalanceRequest,
  TransferRequest,
  MetadataRequest,
  ActualReceivedByTransferRequest,
  ApproveRequest,
  AllowanceRequest,
} from "./BaseTokenAdapter";
import { icrc1Adapter } from "./ICRC1";
import { icrc2Adapter } from "./ICRC2";

export class ICPAdapter extends BaseTokenAdapter<Ledger> {
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

  public async supply() {
    return resultFormat<bigint>(await (await this.actor()).icrc1_total_supply());
  }

  public async balance({ params }: BalanceRequest) {
    if (params.user.address) {
      return resultFormat<bigint>(
        (
          await (
            await this.actor()
          ).account_balance({
            account: Array.from(Uint8Array.from(Buffer.from(params.user.address, "hex"))),
          })
        ).e8s,
      );
    }
    if (params.user.principal) {
      return resultFormat<bigint>(
        await (
          await this.actor()
        ).icrc1_balance_of({
          owner: params.user.principal,
          subaccount: availableArgsNull<Array<number>>(params.subaccount ? params.subaccount : undefined),
        }),
      );
    }

    return resultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.address && !params.to.principal) throw Error("No transfer to");

    if (params.to.address) {
      if (params.memo && !isBigIntMemo(params.memo)) throw Error("Only bigint support (memo)");

      const result = await (
        await this.actor(canisterId, identity)
      ).transfer({
        to: Array.from(Uint8Array.from(Buffer.from(params.to.address, "hex"))),
        memo: (params.memo as bigint) ?? BigInt(0),
        amount: { e8s: params.amount },
        created_at_time: availableArgsNull<{ timestamp_nanos: bigint }>(
          params.create_at_time ? { timestamp_nanos: params.create_at_time } : undefined,
        ),
        from_subaccount: availableArgsNull<number[]>(params.from_sub_account),
        fee: { e8s: BigInt(10000) },
      });

      return resultFormat<bigint>(result);
    }
    if (params.to.principal) {
      const result = await (
        await this.actor(canisterId, identity)
      ).icrc1_transfer({
        to: {
          owner: params.to.principal,
          subaccount: availableArgsNull<Array<number>>(params.subaccount ? params.subaccount : undefined),
        },
        memo: typeof params.memo === "bigint" ? [] : availableArgsNull<number[]>(params.memo),
        amount: params.amount,
        created_at_time: availableArgsNull<bigint>(params.create_at_time),
        from_subaccount: availableArgsNull<Array<number>>(
          params.from_sub_account ? params.from_sub_account : undefined,
        ),
        fee: availableArgsNull<bigint>(null),
      });

      return resultFormat<bigint>(result);
    }

    return resultFormat<bigint>(undefined);
  }

  public async getFee() {
    return resultFormat<bigint>(await (await (await this.actor()).transfer_fee({})).transfer_fee.e8s);
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
    const symbol = (await (await this.actor(canisterId)).symbol()).symbol;
    const decimals = (await (await this.actor()).decimals()).decimals;
    const name = "Internet Computer";
    const fee = resultFormat<bigint>(await (await (await this.actor()).transfer_fee({})).transfer_fee.e8s).data;

    return {
      status: ResultStatus.OK,
      data: {
        decimals,
        metadata: [],
        name,
        symbol,
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
  // @ts-ignore
  actor: async (canisterId?: string, identity?: ActorIdentity) => await ledgerService(identity),
});
