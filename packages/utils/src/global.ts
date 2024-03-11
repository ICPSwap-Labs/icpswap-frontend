import { type NumberType } from "@icpswap/types";
import BigNumber from "bignumber.js";
import { parseTokenAmount } from "./tokenAmount";
import { Principal } from "@dfinity/principal";

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
  var image = new Image();
  image.src = base64String;

  var win = window.open("");
  win?.document.write(image.outerHTML);
}

export function cycleValueFormat(value: NumberType, noUnit?: boolean): string {
  if (value === 0 || !value) return noUnit ? `0` : `0 T`;

  return `${new BigNumber(parseTokenAmount(value, 12).toFixed(4)).toFormat()}${
    noUnit ? "" : " T"
  }`;
}

export type User = { principal: Principal } | { address: string };

export function isPrincipalUser(user: User): user is { principal: Principal } {
  if (user.hasOwnProperty("principal")) return true;
  return false;
}

export function isAddressUser(user: User): user is { address: string } {
  if (user.hasOwnProperty("address")) return true;
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
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function arrayBufferFromHex(hex: string) {
  if (hex.substr(0, 2) === "0x") hex = hex.substr(2);
  for (var bytes: number[] = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}

export function valueofUser(user: User) {
  if (isPrincipalUser(user)) {
    return user.principal;
  } else {
    return user.address;
  }
}

export function splitArr<T>(arr: T[], length: number) {
  const total_length = arr.length;

  if (length >= total_length) {
    return [arr];
  }

  const resultLength = Math.ceil(total_length / length);
  let result: Array<T[]> = [];

  for (let i = 0; i < resultLength; i++) {
    result.push(arr.slice(i * length, i * length + length));
  }

  return result;
}
