export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

export type StatusResult<T> = {
  readonly status: ResultStatus;
  readonly data: T | string;
};

export type StatusResult1<T> = {
  readonly status: ResultStatus;
  readonly data?: T;
  readonly message: string;
};

export type CallResult<T> = {
  readonly result: ApiResult<T>;
  readonly loading: boolean;
};

export type ApiResult<T> = null | undefined | T;

export type PaginationResult<T> = {
  totalElements: number;
  offset: number;
  limit: number;
  content: T[];
};

export type DynamicObject = {
  [key: string]: any;
};
