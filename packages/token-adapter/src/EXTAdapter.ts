import { resultFormat, availableArgsNull, principalToAccount, isOkSubAccount, isBigIntMemo } from "@icpswap/utils";
import { SubAccount } from "@dfinity/ledger-icp";
import { PaginationResult, ResultStatus } from "@icpswap/types";
import { ext } from "@icpswap/actor";
import { EXTToken, TokenUser } from "@icpswap/candid";
import { TokenHolder, Transaction, Metadata } from "./types";
import {
  BaseTokenAdapter,
  HoldersRequest,
  TotalHoldersRequest,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  SetFeeRequest,
  SetFeeToRequest,
  TransactionRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  SetLogoRequest,
  ActualReceivedByTransferRequest,
  BaseTokenResult,
} from "./BaseTokenAdapter";

export class EXTTokenAdapter extends BaseTokenAdapter<EXTToken> {
  public async holders({ canisterId, params }: HoldersRequest) {
    return resultFormat<PaginationResult<TokenHolder>>(
      await (
        await this.actor(canisterId)
      ).holders({
        offset: [params.offset],
        limit: [params.limit],
      }),
    );
  }

  public async totalHolders({ canisterId }: TotalHoldersRequest) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).totalHolders());
  }

  public async supply({ canisterId }: SupplyRequest) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).supply());
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (!params.user.address && !params.user.principal) throw Error("no user address or principal");

    let address = "";

    if (params.user.principal) {
      const sub = params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;
      address = principalToAccount(params.user.principal.toString(), isOkSubAccount(sub) ? sub : undefined);
    } else if (params.user.address) {
      address = params.user.address;
    }

    return resultFormat<bigint>(
      await (
        await this.actor(canisterId)
      ).balance({
        token: params.token,
        user: { address },
      }),
    );
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.address && !params.to.principal) throw Error("No to address or principal");
    if (!params.from.address && !params.from.principal) throw Error("No from address or principal");
    if (isBigIntMemo(params.memo)) throw Error("Can't support bigint (memo)");

    const subaccount = params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;

    return resultFormat<bigint>(
      await (
        await this.actor(canisterId, identity)
      ).transfer({
        token: params.token ?? "",
        to: params.to.principal
          ? params.subaccount
            ? {
                address: principalToAccount(
                  params.to.principal.toString(),
                  isOkSubAccount(subaccount) ? subaccount : undefined,
                ),
              }
            : { address: principalToAccount(params.to.principal.toString()) }
          : { address: params.to.address as string },
        from: params.from.principal
          ? { address: principalToAccount(params.from.principal.toString()) }
          : { address: params.from.address as string },
        memo: params.memo ? params.memo : [],
        subaccount: availableArgsNull<number[]>(undefined),
        nonce: availableArgsNull<bigint>(params.nonce),
        amount: params.amount,
        notify: params.notify ?? true,
      }),
    );
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return resultFormat<boolean>(await (await this.actor(canisterId, identity)).setFee(params));
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    if (!params.address) throw Error("no user address");

    return resultFormat<boolean>(await (await this.actor(canisterId, identity)).setFeeTo({ address: params.address }));
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    let cap_id = params.capId;

    if (!cap_id) {
      const extensions = await this.extensions({ canisterId });

      if (extensions.includes("@ext/cap")) {
        cap_id = (await params.getCapRootId(canisterId))?.toString();
      }
    }

    if (cap_id) {
      if (!params.offset && params.offset !== 0) throw Error("no cap offset");

      if (params.user?.principal) {
        return resultFormat<PaginationResult<Transaction>>(
          await params.getCapUserTransactions(cap_id, params.user?.principal, params.witness ?? false, params.offset),
        );
      }

      return resultFormat<PaginationResult<Transaction>>(
        await params.getCapTransactions(cap_id, params.witness ?? false, params.offset),
      );
    }

    return resultFormat<PaginationResult<Transaction>>(
      await (
        await this.actor(canisterId)
      ).transactions({
        hash: availableArgsNull<string>(params.hash),
        user: availableArgsNull<TokenUser>(params.user?.address ? { address: params.user.address } : undefined),
        offset: availableArgsNull<bigint>(params.offset ? BigInt(params.offset) : null),
        limit: availableArgsNull<bigint>(params.limit ? BigInt(params.limit) : null),
        index: availableArgsNull<bigint>(params.index ? BigInt(params.index) : null),
      }),
    );
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    return resultFormat<boolean>(
      await (
        await this.actor(canisterId, identity)
      ).approve({
        subaccount: params.subaccount ? [Array.from(params.subaccount)] : [],
        spender: params.spender,
        allowance: BigInt(Number.MAX_VALUE),
      }),
    );
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    if (!params.owner.address && !params.owner.principal) throw Error("no owner address or principal");

    return resultFormat<bigint>(
      await (
        await this.actor(canisterId)
      ).allowance({
        owner: params.owner.address ? { address: params.owner.address } : { principal: params.owner.principal! },
        subaccount: params.subaccount ? [Array.from(params.subaccount)] : [],
        spender: params.spender,
      }),
    );
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const metadata = resultFormat<{
      fungible: Metadata;
    }>(await (await this.actor(canisterId)).metadata()).data?.fungible;
    const logo = resultFormat<string>(await (await this.actor(canisterId)).logo()).data;
    const fee = resultFormat<bigint>(await (await this.actor(canisterId)).getFee()).data;

    return {
      status: ResultStatus.OK,
      data: {
        ...metadata,
        logo,
        fee,
      } as Metadata,
      message: "",
    };
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async extensions({ canisterId }: { canisterId: string }) {
    return await (await this.actor(canisterId)).extensions();
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

export const EXTAdapter = new EXTTokenAdapter({
  actor: ext,
});
