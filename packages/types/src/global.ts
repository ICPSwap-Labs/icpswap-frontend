export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

export type ApiResult<T> = undefined | T;

export type Null = null | undefined;

export type Override<P, S> = Omit<P, keyof S> & S;

export type ActorIdentity = true;

export type StatusResult<T> = {
  readonly status: ResultStatus;
  readonly data?: T;
  readonly message: string;
};

export type CallResult<T> = {
  readonly result: ApiResult<T>;
  readonly loading: boolean;
};

export type PaginationResult<T> = {
  totalElements: number;
  offset: number;
  limit: number;
  content: T[];
};
