import { resultFormat } from "@icpswap/utils";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { dip20, dip20BalanceActor, dip20SupplyActor } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";
import { DIP20, type DIP20TokenInfo } from "@icpswap/candid";
import { TokenHolder, Transaction, DIP20Metadata, Metadata } from "./types";
import {
  BaseTokenAdapter,
  HoldersRequest,
  TotalHoldersRequest,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  SetFeeRequest,
  SetFeeToRequest,
  GetFeeRequest,
  TransactionRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  SetLogoRequest,
  ActualReceivedByTransferRequest,
  BaseTokenResult,
} from "./BaseTokenAdapter";

export class DIP20TokenAdapter extends BaseTokenAdapter<DIP20> {
  public async holders({ canisterId, params }: HoldersRequest) {
    const totalHolder = (await this.totalHolders({ canisterId })).data;

    if (totalHolder) {
      const _holders = (await (await this.actor(canisterId)).getHolders(params.offset, params.limit)) as Array<
        [Principal, bigint]
      >;

      const holders = _holders.map((holder) => {
        return {
          balance: holder[1],
          account: holder[0].toString(),
        };
      }) as TokenHolder[];

      return {
        status: ResultStatus.OK,
        message: "",
        data: {
          content: holders,
          totalElements: Number(totalHolder),
          limit: Number(params.limit),
          offset: Number(params.offset),
        } as PaginationResult<TokenHolder>,
      };
    }

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

  public async totalHolders({ canisterId }: TotalHoldersRequest) {
    let tokenInfo: null | DIP20TokenInfo = null;

    try {
      tokenInfo = (await (await this.actor(canisterId)).getTokenInfo()) as DIP20TokenInfo;
      return resultFormat<bigint>(tokenInfo.holderNumber);
    } catch (error) {
      console.error(error);
    }

    return resultFormat<bigint>(undefined);
  }

  public async supply({ canisterId }: SupplyRequest) {
    try {
      return resultFormat<bigint>(await (await this.actor(canisterId)).totalSupply());
    } catch (error) {
      console.error(error);
      return resultFormat<bigint>(await (await dip20SupplyActor(canisterId)).totalSupply());
    }
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (params.user.principal) {
      let balance = BigInt(0);

      try {
        balance = (await (await this.actor(canisterId)).balanceOf(params.user.principal)) as bigint;
      } catch (error) {
        console.error(error);
        balance = (await (await dip20BalanceActor(canisterId)).balanceOf(params.user.principal)) as bigint;
      }

      return resultFormat<bigint>(balance);
    }

    return resultFormat<bigint>(BigInt(0));
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

  public async transactions({ canisterId, params }: TransactionRequest) {
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

  public async setLogo({ canisterId, params, identity }: SetLogoRequest) {
    return resultFormat<boolean>(await (await this.actor(canisterId, identity)).setLogo(params));
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async getMintingAccount({
    canisterId,
  }: {
    canisterId: string;
  }): BaseTokenResult<{ owner: string; sub: number[] | undefined }> {
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
