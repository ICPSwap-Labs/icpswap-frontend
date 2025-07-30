import { Null, type NumberType } from "@icpswap/types";
import BigNumber from "bignumber.js";
import { Principal } from "@dfinity/principal";

import { parseTokenAmount } from "./tokenAmount";
import { isUndefinedOrNull } from "./isUndefinedOrNull";

export function transactionsTypeFormat(type: any): string {
  if (typeof type === "string") return type;
  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }
  return type;
}

export function openBase64ImageInNewWindow(base64String: string) {
  const image = new Image();
  image.src = base64String;

  const win = window.open("");
  win?.document.write(image.outerHTML);
}

export function cycleValueFormat(value: NumberType | Null, noUnit?: boolean): string {
  if (value === 0 || isUndefinedOrNull(value)) return noUnit ? `0` : `0 T`;

  return `${new BigNumber(parseTokenAmount(value, 12).toFixed(4)).toFormat()}${noUnit ? "" : " T"}`;
}

export type User = { principal: Principal } | { address: string };

export function isPrincipalUser(user: User): user is { principal: Principal } {
  if ("principal" in user) return true;
  return false;
}

export function isAddressUser(user: User): user is { address: string } {
  if ("address" in user) return true;
  return false;
}

export function stringToArrayBuffer(string: string): Uint8Array {
  return new TextEncoder().encode(string);
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder("utf-8").decode(arrayBuffer);
}

export function arrayBufferToHex(arrayBuffer: Uint8Array) {
  return Array.from([...arrayBuffer], function (byte) {
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }).join("");
}

export function arrayBufferFromHex(hex: string) {
  let __hex = hex;

  if (__hex.substr(0, 2) === "0x") __hex = __hex.substr(2);

  const bytes: number[] = [];
  for (let c = 0; c < __hex.length; c += 2) bytes.push(parseInt(__hex.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}

export function valueofUser(user: User) {
  if (isPrincipalUser(user)) {
    return user.principal;
  }
  return user.address;
}

export function splitArr<T>(arr: T[], length: number) {
  const total_length = arr.length;

  if (length >= total_length) {
    return [arr];
  }

  const resultLength = Math.ceil(total_length / length);
  const result: Array<T[]> = [];

  for (let i = 0; i < resultLength; i++) {
    result.push(arr.slice(i * length, i * length + length));
  }

  return result;
}

export function toDoubleNumber(val: number | string) {
  const __val = Number(val);

  if (__val < 10) return `0${__val}`;

  return val.toString();
}
