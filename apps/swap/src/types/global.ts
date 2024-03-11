import type { Ed25519KeyIdentity, Secp256k1KeyIdentity } from "@dfinity/identity";
import { ActorIdentity } from "@icpswap/types";

export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

export type StatusResult<T> = {
  readonly status: ResultStatus;
  readonly data: T | string;
};

export type CallResult<T> = {
  readonly result: ApiResult<T>;
  readonly loading: boolean;
};

export type ApiResult<T> = undefined | T;

export type PaginationResult<T> = {
  totalElements: number;
  offset: number;
  limit: number;
  content: T[];
};

export type DynamicObject = {
  [key: string]: any;
};

export type ICPIdentity = Ed25519KeyIdentity | Secp256k1KeyIdentity;

export type Identity = ActorIdentity;

export type Override<P, S> = Omit<P, keyof S> & S;
