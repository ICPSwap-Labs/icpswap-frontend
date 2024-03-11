import {
  TokenHolderArgs,
  TokenHolder,
  BalanceRequest as _BalanceRequest,
  TokenTransferRequest as _TransferRequest,
  SetFeeToRequest as _SetFeeToRequest,
  TransactionRequest as _TransactionRequest,
  Transaction,
  TokenAllowanceRequest,
  TokenApproveRequest,
  Metadata,
} from "./types";
import { BigNumber } from "bignumber.js";
import {
  Override,
  ActorIdentity,
  StatusResult,
  PaginationResult,
} from "@icpswap/types";
import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import type { TokenTransaction } from "@icpswap/types";

export type BaseTokenRequestNoParams = {
  canisterId: string;
};

export type BaseTokenRequest<T> = {
  canisterId: string;
  params: T;
};

export type BaseTokenIdentityRequest<T> = {
  canisterId: string;
  params: T;
  identity: ActorIdentity;
};

export type BaseTokenResult<T> = Promise<StatusResult<T>>;

export interface TotalHoldersRequest {
  canisterId: string;
}

export type TotalHoldersResult = BaseTokenResult<bigint>;

export type HoldersRequest = BaseTokenRequest<{
  offset: bigint;
  limit: bigint;
}>;
export type HoldersResult = BaseTokenResult<PaginationResult<TokenHolder>>;

export type SupplyRequest = { canisterId: string };
export type SupplyResult = Promise<StatusResult<bigint>>;

export type BalanceRequest = BaseTokenRequest<_BalanceRequest>;
export type BalanceResult = Promise<StatusResult<bigint>>;

export type TransferRequest = BaseTokenIdentityRequest<_TransferRequest>;
export type TransferResult = BaseTokenResult<bigint>;

export type GetFeeRequest = BaseTokenRequestNoParams;
export type GetFeeResult = BaseTokenResult<bigint>;
export type SetFeeRequest = BaseTokenIdentityRequest<bigint>;
export type SetFeeResult = BaseTokenResult<boolean>;
export type SetFeeToRequest = BaseTokenIdentityRequest<_SetFeeToRequest>;
export type SetFeeToResult = BaseTokenResult<boolean>;

export type TransactionRequest = BaseTokenRequest<
  Override<
    _TransactionRequest,
    {
      capId?: string;
      getCapRootId?: (canisterId: string) => Promise<Principal>;
      getCapUserTransactions?: (
        canisterId: string,
        principal: Principal,
        witness: boolean,
        offset: number
      ) => Promise<{
        totalElements: number;
        offset: number;
        limit: number;
        content: TokenTransaction[];
      }>;
      getCapTransactions?: (
        canisterId: string,
        witness: boolean,
        offset: number
      ) => Promise<{
        totalElements: number;
        offset: number;
        limit: number;
        content: TokenTransaction[];
      }>;
      witness?: boolean;
    }
  >
>;
export type TransactionResult = BaseTokenResult<PaginationResult<Transaction>>;

export type ApproveRequest = BaseTokenIdentityRequest<TokenApproveRequest>;
export type ApproveResult = BaseTokenResult<boolean>;
export type AllowanceRequest = BaseTokenRequest<TokenAllowanceRequest>;
export type AllowanceResult = BaseTokenResult<bigint>;

export type MetadataRequest = BaseTokenRequestNoParams;
export type MetadataResult = BaseTokenResult<Metadata>;

export type SetLogoRequest = BaseTokenIdentityRequest<string>;
export type SetLogoResult = BaseTokenResult<boolean>;
export type LogoRequest = BaseTokenRequestNoParams;
export type LogoResult = BaseTokenResult<string>;

export type ActualReceivedByTransferRequest = {
  amount: BigNumber;
  fee: BigNumber;
  canisterId: string;
};
export type ActualReceivedByTransferResult = BigNumber;

export abstract class BaseTokenAdapter<T> {
  public readonly actor: (
    canister?: string,
    identity?: ActorIdentity
  ) => Promise<ActorSubclass<T>>;

  constructor({
    actor,
  }: {
    actor: (
      canister?: string,
      identity?: ActorIdentity
    ) => Promise<ActorSubclass<T>>;
  }) {
    this.actor = actor;
  }

  public abstract totalHolders({
    canisterId,
  }: TotalHoldersRequest): TotalHoldersResult;

  public abstract holders({
    canisterId,
    params,
  }: HoldersRequest): HoldersResult;

  public abstract supply({ canisterId }: SupplyRequest): SupplyResult;

  public abstract balance({
    canisterId,
    params,
  }: BalanceRequest): BalanceResult;

  public abstract transfer(request: TransferRequest): TransferResult;

  public abstract setFee(request: SetFeeRequest): SetFeeResult;

  public abstract setFeeTo(request: SetFeeToRequest): SetFeeToResult;

  public abstract transactions(request: TransactionRequest): TransactionResult;

  public abstract approve(request: ApproveRequest): ApproveResult;

  public abstract allowance(request: AllowanceRequest): AllowanceResult;

  public abstract metadata(request: MetadataRequest): MetadataResult;

  public abstract setLogo(request: SetLogoRequest): SetLogoResult;

  public abstract actualReceivedByTransfer(
    request: ActualReceivedByTransferRequest
  ): ActualReceivedByTransferResult;
}
