import { resultFormat } from "@icpswap/utils";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { dip20, dip20BalanceActor, dip20SupplyActor } from "@icpswap/actor";
import { DIP20 } from "@icpswap/candid";
import { Transaction, DIP20Metadata, Metadata } from "./types";
import {
  BaseTokenAdapter,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  SetFeeRequest,
  SetFeeToRequest,
  GetFeeRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  ActualReceivedByTransferRequest,
  BaseTokenResult,
} from "./BaseTokenAdapter";

export class DIP20TokenAdapter extends BaseTokenAdapter<DIP20> {
  public async supply({ canisterId }: SupplyRequest) {
    try {
      return resultFormat<bigint>(await (await this.actor(canisterId)).totalSupply());
    } catch (error) {
      console.error(error);
      return resultFormat<bigint>(await (await dip20SupplyActor(canisterId)).totalSupply());
    }
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (!params.user.principal || params.subaccount) {
      return resultFormat<bigint>(BigInt(0));
    }
    try {
      const balance = (await (await this.actor(canisterId)).balanceOf(params.user.principal)) as bigint;
      return resultFormat<bigint>(balance);
    } catch (error) {
      console.error(error);
      const balance = (await (await dip20BalanceActor(canisterId)).balanceOf(params.user.principal)) as bigint;
      return resultFormat<bigint>(balance);
    }
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.principal) throw Error("no user principal");

    const result = await (await this.actor(canisterId, identity)).transfer(params.to.principal, params.amount);
    return resultFormat<bigint>(result);
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    const metadata = await (await this.actor(canisterId)).getMetadata();
    return resultFormat<bigint>(metadata.fee);
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return resultFormat<boolean>(await (await this.actor(canisterId, identity)).setFee(params));
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    if (!params.principal) throw Error("no principal");
    return resultFormat<boolean>(await (await this.actor(canisterId, identity)).setFeeTo(params.principal));
  }

  public async transactions() {
    return resultFormat<PaginationResult<Transaction>>({
      Ok: {
        content: [],
        totalElements: BigInt(0),
        offset: BigInt(0),
        limit: BigInt(10),
      },
    });
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    // 10 times approve amount to fix dip20 insufficient allowance amount
    // TODO: A better way to fix it
    return resultFormat<boolean>(
      await (await this.actor(canisterId, identity)).approve(params.spender, params.allowance * BigInt(10)),
    );
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    if (!params.owner.principal) {
      throw Error("no principal");
    }

    return resultFormat<bigint>(await (await this.actor(canisterId)).allowance(params.owner.principal, params.spender));
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const metadata = (await (await this.actor(canisterId)).getMetadata()) as DIP20Metadata;

    return {
      status: ResultStatus.OK,
      data: {
        decimals: metadata.decimals,
        metadata: [],
        name: metadata.name,
        symbol: metadata.symbol,
        logo: metadata.logo,
        fee: metadata.fee,
      } as Metadata,
      message: "",
    };
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async getMintingAccount(): BaseTokenResult<{ owner: string; sub: number[] | undefined }> {
    return {
      status: ResultStatus.OK,
      data: undefined,
      message: "",
    };
  }
}

export const DIP20Adapter = new DIP20TokenAdapter({
  actor: dip20,
});
