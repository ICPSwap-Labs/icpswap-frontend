export enum ResultStatus {
  ERROR = "err",
  OK = "ok",
}

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
