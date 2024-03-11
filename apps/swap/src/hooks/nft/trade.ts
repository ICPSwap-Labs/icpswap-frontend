import { useCallback } from "react";
import { resultFormat, availableArgsNull, isAvailablePageArgs } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";
import { StatusResult1, PaginationResult, getCanisterId, CANISTER_NAMES } from "constants/index";
import { Principal } from "@dfinity/principal";
import { TradeOrder, TxRecord, Identity } from "types";
import type { NFTSaleArgs } from "@icpswap/types";
import { NFTs, AdapterName, NFTsTrade, TradeAdapterName } from "utils/nft/index";
import { NFTTradeCanister } from "@icpswap/actor";

export interface AllowanceArgs {
  canisterId: string;
  account: string;
  spenderCanisterId: string;
  tokenIdentifier: string;
}

export async function allowance({ canisterId, account, spenderCanisterId, tokenIdentifier }: AllowanceArgs) {
  return (
    await NFTs.allowance({
      adapterName: AdapterName.ICPSwap,
      canisterId,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        token: tokenIdentifier,
        owner: { address: account },
      },
    })
  ).data;
}

export interface ApproveArgs {
  identity: Identity;
  canisterId: string;
  tokenIdentifier: string;
  account: string;
}

export async function approve({ identity, canisterId, tokenIdentifier, account }: ApproveArgs) {
  const spenderCanisterId = getCanisterId(CANISTER_NAMES.NFTTrade);

  const allowanceBalance = await allowance({ canisterId, tokenIdentifier, spenderCanisterId, account });

  if (allowanceBalance !== BigInt(1)) {
    await NFTs.approve({
      canisterId,
      identity,
      adapterName: AdapterName.ICPSwap,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        token: tokenIdentifier,
        subaccount: [],
        allowance: BigInt(1),
      },
    });
  }

  return true;
}

export async function sell(identity: Identity, params: NFTSaleArgs): Promise<StatusResult1<boolean>> {
  return await NFTsTrade.sale({
    adapterName: TradeAdapterName.ICPSwap,
    identity,
    params,
  });
}

export async function getTradeOrders(
  canisterId: string | null | undefined,
  name: string | null,
  user: string | null,
  token: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean = false,
) {
  return resultFormat<PaginationResult<TradeOrder>>(
    await (
      await NFTTradeCanister()
    ).findOrderPage(
      availableArgsNull<string>(canisterId),
      availableArgsNull<string>(name),
      availableArgsNull<string>(user),
      availableArgsNull<number>(token),
      BigInt(offset),
      BigInt(limit),
      sort,
      desc,
    ),
  ).data;
}

export function useNFTTradeOrder(
  canisterId: string | null | undefined,
  name: string | null,
  user: string | null,
  token: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean = false,
) {
  return useCallsData(
    useCallback(async () => {
      if (!sort || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTradeOrders(canisterId, name, user, token, offset, limit, sort, desc);
    }, [canisterId, name, offset, limit, sort, desc]),
  );
}

export function useNFTBuyCallback() {
  return useCallback(async (identity: Identity, canisterId: string, tokenIndex: bigint | string | number) => {
    return await NFTsTrade.buy({
      identity,
      params: { nftCid: canisterId, tokenIndex: Number(tokenIndex) },
      adapterName: TradeAdapterName.ICPSwap,
    });
  }, []);
}

export async function cancel(identity: Identity, canisterId: string, tokenIndex: number | bigint) {
  return await NFTsTrade.revoke({
    identity,
    params: { nftCid: canisterId, tokenIndex: Number(tokenIndex) },
    adapterName: TradeAdapterName.ICPSwap,
  });
}

export function useTradeTxList(
  canisterId: string | null | undefined,
  name: string | null | undefined,
  tokenIndex: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TxRecord>>(
        await (
          await NFTTradeCanister()
        ).findTxPage(
          availableArgsNull<string>(canisterId),
          availableArgsNull<string>(name),
          availableArgsNull<number>(tokenIndex),
          BigInt(offset),
          BigInt(limit),
          sort,
          desc,
        ),
      ).data;
    }, [canisterId, name, offset, limit, sort]),
  );
}

export function useUserTradeTxList(
  account: string,
  canisterId: string | null | undefined,
  name: string | null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TxRecord>>(
        await (
          await NFTTradeCanister()
        ).findUserTxPage(
          account,
          availableArgsNull<string>(canisterId),
          availableArgsNull<string>(name),
          BigInt(offset),
          BigInt(limit),
          sort,
          desc,
        ),
      ).data;
    }, [account, canisterId, name, offset, limit, sort]),
  );
}

export function useNFTRecommend(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TradeOrder>>(
        await (await NFTTradeCanister()).findRecommend(BigInt(offset), BigInt(limit)),
      ).data;
    }, [offset, limit]),
  );
}

export function useNFTOrderInfo(
  canisterId: string | undefined,
  tokenIndex: number | bigint | undefined,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !tokenIndex) return undefined;
      return resultFormat<TradeOrder>(await (await NFTTradeCanister()).getOrder(canisterId, Number(tokenIndex))).data;
    }, [canisterId, tokenIndex]),
    reload,
  );
}

export async function checkPayment(tx: string) {
  return resultFormat<boolean>(await (await NFTTradeCanister()).checkPayment(tx));
}
