import { StatusResult, ResultStatus } from "@icpswap/types";
import isObject from "lodash/isObject";

export function isResultErrKey(key: string) {
  return key === ResultStatus.ERROR || key === "Err";
}

export function isResultOkKey(key: string) {
  return key === ResultStatus.OK || key === "Ok";
}

export function isResultKey(key: string) {
  return isResultErrKey(key) || isResultOkKey(key);
}

export function resultFormat<T>(result: any): StatusResult<T> {
  if (result === null || result === undefined) {
    return {
      status: ResultStatus.ERROR,
      message: "",
      data: undefined,
    };
  }

  const key = Object.keys(result);

  if (result && isObject(result as object) && key && key[0] && isResultKey(key[0])) {
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
