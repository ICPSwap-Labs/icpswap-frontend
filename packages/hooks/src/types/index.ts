export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

export type EnumResult<T> =
  | {
      [ResultStatus.OK]: T;
    }
  | { [ResultStatus.ERROR]: string };

export type StatusResult<T> = {
  readonly status: ResultStatus;
  readonly data?: T;
  readonly message: string;
};

export type CallResult<T> = {
  readonly result: ApiResult<T>;
  readonly loading: boolean;
};

export type ApiResult<T> = undefined | T;

export type Override<P, S> = Omit<P, keyof S> & S;
