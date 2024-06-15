/* eslint-disable no-extend-native */
import _BigNumber from "bignumber.js";
import { APP_LINK } from "constants/index";
import { parseTokenAmount, explorerLink } from "@icpswap/utils";
import JSBI from "jsbi";
import { ICP_TOKEN_INFO, WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";

// @ts-ignore hijack bigint
BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

_BigNumber.set({ EXPONENTIAL_AT: 10 ** 9 });

_BigNumber.config({
  ROUNDING_MODE: _BigNumber.ROUND_DOWN,
});

export const BigNumber = _BigNumber;

export { _BigNumber, JSBI };

export const NO_GROUP_SEPARATOR_FORMATTER = {
  groupSeparator: "",
};

export const cycleValueFormat = (value: string | number | bigint | undefined, noUnit?: boolean): string => {
  if (value === undefined) return "--";
  if (value === 0 || !value) return noUnit ? `0` : `0 T`;
  return `${new BigNumber(parseTokenAmount(value, 12).toFixed(4)).toFormat()}${noUnit ? "" : " T"}`;
};

export function transactionsTypeFormat(type: any): string {
  if (typeof type === "string") return type;
  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }
  return type;
}

export function isDarkTheme(theme: any): boolean {
  return theme.customization.navType === "dark";
}

export const isICPSwapOfficial = (account: string | undefined): boolean => {
  return (
    account === "b2b33b29fa0f9458ec7ba0025f6a53126043fad143dd17619d5f162f41e69869" ||
    account === "e695fda51d898ad6f46211d8f468f85dd1364819e52c7740e4b4db90918ea6bc" ||
    account === "fbe00b464da19fc7bf234cf05e376631ad896163558174c375f6e9be96d95e95" ||
    account === "1ce94412fa0ad3b93132c651105d86e17bb87bafc78e9010a9e24a47a98e5b03"
  );
};

export function isAvailablePageArgs(offset: number, limit: number): boolean {
  return (!!offset || offset === 0) && !!limit;
}

export function getExplorerPrincipalLink(principalId: string): string {
  return explorerLink(principalId);
}

export function getExplorerAccountLink(account: string): string {
  return `https://icscan.io/account/${account}`;
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder("utf-8").decode(arrayBuffer);
}

export function percentageFormat(num: bigint | number | string | undefined | null, digits = 2) {
  if (num || num === 0 || num === BigInt(0)) {
    return `${new BigNumber(String(num)).div(100).toFixed(digits)}%`;
  }
  return undefined;
}

export function swapLink(canisterId: string) {
  if (canisterId === ICP_TOKEN_INFO.canisterId || canisterId === WRAPPED_ICP_TOKEN_INFO.canisterId)
    return `${APP_LINK}/swap?input=${ICP_TOKEN_INFO.canisterId}`;
  return `${APP_LINK}/swap?input=${ICP_TOKEN_INFO.canisterId}&output=${canisterId}`;
}

export function addLiquidityLink(canisterId: string) {
  if (canisterId === ICP_TOKEN_INFO.canisterId || canisterId === WRAPPED_ICP_TOKEN_INFO.canisterId)
    return `${APP_LINK}/liquidity/add/${ICP_TOKEN_INFO.canisterId}/`;
  return `${APP_LINK}/liquidity/add/${ICP_TOKEN_INFO.canisterId}/${canisterId}/3000`;
}

export function toFormat(value: string | number | undefined) {
  if (value === undefined) return "";
  return new BigNumber(value).toFormat();
}

export * from "./nft";
