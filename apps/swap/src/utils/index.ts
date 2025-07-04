/* eslint-disable no-extend-native */

import JSBI from "jsbi";
import BigNumber from "bignumber.js";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";

// @ts-ignore  hijack bigint
BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

// avoid scientific notation when use toString
BigNumber.set({ EXPONENTIAL_AT: 10 ** 9 });

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export const NO_GROUP_SEPARATOR_FORMATTER = {
  groupSeparator: "",
};

export { JSBI };

export function isDarkTheme(theme: any): boolean {
  return theme.customization.mode === "dark";
}

export function isICPSwapOfficial(account: string | undefined): boolean {
  return (
    account === "b2b33b29fa0f9458ec7ba0025f6a53126043fad143dd17619d5f162f41e69869" ||
    account === "e695fda51d898ad6f46211d8f468f85dd1364819e52c7740e4b4db90918ea6bc" ||
    account === "fbe00b464da19fc7bf234cf05e376631ad896163558174c375f6e9be96d95e95" ||
    account === "1ce94412fa0ad3b93132c651105d86e17bb87bafc78e9010a9e24a47a98e5b03" ||
    account === "9b0812ed39fe6e63c442d7a81672c0c2568ce10011dffc0e50a635250ff6967f"
  );
}

export function stringToArrayBuffer(string: string): Uint8Array {
  return new TextEncoder().encode(string);
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder("utf-8").decode(arrayBuffer);
}

export type CountingTime = {
  hour: string | number;
  min: string | number;
  sec: string | number;
};

export function toDoubleNumber(string: number | string) {
  const newString = String(string);

  if (newString.length < 2) {
    return `0${newString}`;
  }

  return string;
}

export function counter(time: string | number | Date): CountingTime {
  const now = new Date().getTime();
  const end = new Date(time).getTime();

  const diff = end - now;

  if (diff <= 0) {
    return {
      hour: "00",
      min: "00",
      sec: "00",
    };
  }

  const sec = parseInt(String((diff / 1000) % 60));
  const min = parseInt(String((diff / (60 * 1000)) % 60));
  const hour = parseInt(String(diff / (60 * 60 * 1000)));

  return {
    hour: toDoubleNumber(hour),
    min: toDoubleNumber(min),
    sec: toDoubleNumber(sec),
  };
}

export function toFormat(value: string | number | BigNumber | undefined) {
  if (value === undefined) return "";
  return new BigNumber(value).toFormat();
}

export function timeParser(time: any): Date {
  const date = new Date(time);
  const seconds = date.getSeconds();
  return new Date(date.getTime() - seconds * 1000);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function stringifyBackPath(path: string | Null) {
  return isUndefinedOrNull(path) ? "" : window.btoa(path);
}

export function parseBackPath(path: string) {
  return window.atob(path);
}

export * from "./type";
export * from "./nft";
export * from "./swap";
export * from "./token";
