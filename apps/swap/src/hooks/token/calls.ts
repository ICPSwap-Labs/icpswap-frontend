import { useCallback } from "react";
import {
  numberToString,
  BigNumber,
  isValidPrincipal,
  resultFormat,
  isAvailablePageArgs,
  parseTokenAmount,
} from "@icpswap/utils";
import { ICP } from "constants/tokens";
import { Principal } from "@dfinity/principal";
import { Identity } from "types/index";
import { TokenInfo } from "types/token";
import { tokenAdapter, icpAdapter } from "@icpswap/token-adapter";
import { tokenList } from "@icpswap/actor";
import { getTokenStandard } from "store/token/cache/hooks";
import TokenDefaultLogo from "assets/images/Token_default_logo.png";
import { useCallsData } from "@icpswap/hooks";
import { ResultStatus, StatusResult, TOKEN_STANDARD } from "@icpswap/types";

export async function getTokenTotalHolder(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return (
    await tokenAdapter.totalHolders({
      canisterId,
    })
  ).data;
}

export function useTokenTotalHolder(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenTotalHolder(canisterId);
    }, [canisterId]),
    reload,
  );
}

export function useTokenHolders(canisterId: string, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return (
        await tokenAdapter.holders({
          canisterId,
          params: {
            offset: BigInt(offset),
            limit: BigInt(limit),
          },
        })
      ).data;
    }, [offset, limit, canisterId]),
  );
}

export interface TokenTransferProps {
  canisterId: string;
  to: string;
  amount: BigNumber | number;
  identity: Identity;
  from: string;
  subaccount?: number[];
  memo?: number[] | bigint;
  fee?: number | string | bigint;
  decimals?: number;
}

export async function tokenTransfer({
  canisterId,
  to,
  amount,
  identity,
  from,
  subaccount,
  memo,
  fee,
  decimals,
}: TokenTransferProps) {
  let result: StatusResult<bigint> = { data: undefined, message: "", status: ResultStatus.ERROR };

  if (canisterId === ICP.address) {
    result = await icpAdapter.transfer({
      canisterId,
      identity,
      params: {
        from: isValidPrincipal(from) ? { principal: Principal.fromText(from) } : { address: from },
        to: isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
        amount: BigInt(numberToString(amount)),
        subaccount,
        memo,
      },
    });
  } else {
    result = await tokenAdapter.transfer({
      identity,
      canisterId,
      params: {
        from: isValidPrincipal(from) ? { principal: Principal.fromText(from) } : { address: from },
        to: isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
        amount: BigInt(numberToString(amount)),
        subaccount,
        memo,
        fee: fee !== undefined ? BigInt(fee) : undefined,
      },
    });
  }

  const { data, message, status } = result;

  let new_message = message;

  if (new_message.includes("InsufficientFunds")) {
    const balance = new_message.replace(/\D/g, "");

    if (balance) {
      new_message = `InsufficientFunds: ${decimals ? parseTokenAmount(balance, decimals).toFormat() : balance}`;
    }
  }

  return {
    status,
    message: new_message,
    data,
  } as StatusResult<bigint>;
}

export async function getTokenTransaction(
  canisterId: string,
  account: string | undefined,
  offset: number,
  limit: number,
) {
  return (
    await tokenAdapter.transactions({
      canisterId,
      params: {
        user: account ? { address: account } : undefined,
        offset,
        limit,
      },
    })
  ).data;
}

export function useTokenTransactions(canisterId: string, account: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return getTokenTransaction(canisterId, account, offset, limit);
    }, [offset, limit, canisterId]),
  );
}

export async function getTokenSupply(canisterId: string | undefined) {
  if (!canisterId) return undefined;
  return (await tokenAdapter.supply({ canisterId })).data;
}

export function useTokenSupply(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenSupply(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getTokenMetadata(canisterId: string) {
  return tokenAdapter.metadata({ canisterId });
}

export function useTokenMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return (await getTokenMetadata(canisterId)).data;
    }, [canisterId]),
  );
}

export async function getTokenListLogo(canisterId: string | undefined) {
  if (!canisterId) return undefined;
  return resultFormat<string>(await (await tokenList()).getLogo(canisterId)).data;
}

function isICRCToken(tokenId: string) {
  const tokenStandard = getTokenStandard(tokenId);
  return tokenStandard === TOKEN_STANDARD.ICRC1 || tokenStandard === TOKEN_STANDARD.ICRC2;
}

export async function getTokenInfo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return Promise.all([
    getTokenMetadata(canisterId),
    isICRCToken(canisterId) ? getTokenListLogo(canisterId) : null,
  ]).then(([result, logo]) => {
    if (!result) return undefined;

    const metadata = result.data;

    if (!metadata || metadata.decimals === undefined || metadata.fee === undefined || metadata.symbol === undefined)
      return undefined;

    const _logo = isICRCToken(canisterId) ? logo || metadata.logo : metadata.logo;

    return {
      logo: _logo || TokenDefaultLogo,
      transFee: metadata.fee,
      decimals: metadata.decimals,
      name: metadata.name,
      symbol: metadata.symbol,
      canisterId,
      standardType: getTokenStandard(canisterId) ?? TOKEN_STANDARD.ICRC1,
      totalSupply: BigInt(0),
    } as TokenInfo;
  });
}

export function useTokenInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenInfo(canisterId);
    }, [canisterId]),
  );
}
