import { ResultStatus, type StatusResult } from "@icpswap/types";
import isObject from "lodash/isObject";
import { isUndefinedOrNull } from "./isUndefinedOrNull";

/** True if `key` denotes an error variant (`ERROR` or `"Err"`). */
export function isResultErrKey(key: string) {
  return key === ResultStatus.ERROR || key === "Err";
}

/** True if `key` denotes a success variant (`OK` or `"Ok"`). */
export function isResultOkKey(key: string) {
  return key === ResultStatus.OK || key === "Ok";
}

/** True if `key` is either an ok or err result key. */
export function isResultKey(key: string) {
  return isResultErrKey(key) || isResultOkKey(key);
}

/**
 * Normalizes canister/API-style `{ Ok: T }` / `{ Err: ... }` (or status enums) into {@link StatusResult}.
 */
export function resultFormat<T>(result: any): StatusResult<T> {
  if (isUndefinedOrNull(result)) {
    return {
      status: ResultStatus.ERROR,
      message: "",
      data: undefined,
    };
  }

  const key = Object.keys(result);

  if (isObject(result as object) && key?.[0] && isResultKey(key[0])) {
    let message = "";

    if (isResultErrKey(key[0]) && isObject(result[key[0]])) {
      const messageKey = Object.keys(result[key[0]])[0];
      const value = result[key[0]][messageKey];

      // TODO: for token
      if (messageKey === "Other") {
        message = value;
      } else {
        if (typeof value === "object") {
          message = `${messageKey}: ${JSON.stringify(value).replace(/"/g, "")}`;
        } else {
          message = `${messageKey}: ${value}`;
        }
      }
    } else if (typeof result[key[0]] === "string") {
      message = result[key[0]];
    }

    return {
      status: isResultErrKey(key[0]) ? ResultStatus.ERROR : ResultStatus.OK,
      data: isResultOkKey(key[0]) ? (result[key[0]] as T) : undefined,
      message,
    };
  }

  return {
    status: ResultStatus.OK,
    data: result as T,
    message: "",
  };
}
