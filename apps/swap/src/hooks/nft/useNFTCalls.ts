import { useCallback } from "react";
import { PaginationResult, Identity } from "types/index";
import type {
  NFTTokenMetadata,
  NFTTransaction,
  NFTCanisterInfo,
  NFTTransferArgs,
  NFTControllerArgs,
  NFTBatchMintArgs,
  NFTControllerInfo,
  StatusResult,
  Null,
} from "@icpswap/types";
import { OLD_CANISTER_IDS } from "constants/nft";
import { resultFormat, principalToAccount, isAvailablePageArgs } from "@icpswap/utils";
import { swapNFT, NFTCanisterController, NFTCanister } from "@icpswap/actor";
import { useCallsData } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";

export async function approveForAll(identity: Identity, spenderCanisterId: string) {
  const spender = principalToAccount(spenderCanisterId);
  const result = await (await swapNFT(identity)).approveForAll({ spender: { address: spender }, approved: true });
  return resultFormat(result);
}

export async function allowanceAll(account: string, spenderCanisterId: string) {
  const spender = principalToAccount(spenderCanisterId);
  return resultFormat<boolean>(await (await swapNFT()).isApproveForAll(account, spender)).data;
}

export async function findTokenListByPool(principal: Principal, pool: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (await swapNFT()).findTokenListByPool(pool, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserNFTs(user: Principal | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<NFTTokenMetadata>>(
        await (await swapNFT()).findTokenList({ principal: user }, BigInt(offset), BigInt(limit)),
      ).data;
    }, [user]),
  );
}

export async function getSwapNFTTokenURI(tokenId: bigint | number) {
  const { data } = resultFormat<string>(await (await swapNFT()).tokenURI(BigInt(tokenId)));
  return JSON.parse(data ?? "") as { image: string; [key: string]: any };
}

export function useMintNFTCallback(): (
  canisterId: string,
  identity: Identity,
  params: NFTBatchMintArgs,
) => Promise<StatusResult<bigint>> {
  return useCallback(async (canisterId, identity, params) => {
    if (params.count && BigInt(params.count) > 1) {
      return resultFormat<bigint>(await (await NFTCanister(canisterId, identity)).mint_batch(params));
    }

    return resultFormat<bigint>(
      await (
        await NFTCanister(canisterId, identity)
      ).mint({
        ...params,
      }),
    );
  }, []);
}

export function useNFTMetadata(
  canisterId: string | undefined | null,
  tokenId: number | bigint | null | undefined,
  reload?: any,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || (!tokenId && tokenId !== 0)) return undefined;
      return resultFormat<NFTTokenMetadata>(await (await NFTCanister(canisterId)).icsMetadata(Number(tokenId))).data;
    }, [tokenId]),
    reload,
  );
}

export function useNFTTransaction(
  canisterId: string,
  tokenIdentifier: string | null | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !tokenIdentifier || !isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTTransaction>>(
        await (await NFTCanister(canisterId)).findTxRecord(tokenIdentifier, BigInt(offset), BigInt(limit)),
      ).data;
    }, [canisterId, tokenIdentifier, offset, limit]),
    reload,
  );
}

export function useUserNFTTransactions(canisterId: string, principal: string | Null, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<NFTTransaction>>(
        await (
          await NFTCanister(canisterId)
        ).findTokenTxRecord({ principal: Principal.fromText(principal) }, BigInt(offset), BigInt(limit)),
      ).data;
    }, [principal, offset, limit]),
  );
}

export function useNFTTransferCallback(): (
  canisterId: string,
  identity: Identity,
  params: NFTTransferArgs,
) => Promise<StatusResult<boolean>> {
  return useCallback(
    async (canisterId, identity, params) =>
      resultFormat<boolean>(await (await NFTCanister(canisterId, identity)).transfer(params)),
    [],
  );
}

export function useCanisterCycles(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).cycleBalance()).data;
    }, [canisterId]),
  );
}

export function useCanisterUserNFTCount(canisterId: string, account: string, reload?: boolean | number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !account) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).ownerNFTCount({ address: account })).data;
    }, [canisterId, account]),
    reload,
  );
}

export function useNFTCanisterList(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
      ).data;
    }, [offset, limit]),
  );
}

export function useUserCanisterList(account: string, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findUserCanister(account, BigInt(offset), BigInt(limit)),
      ).data;
    }, [offset, limit]),
  );
}

export async function createCanister(values: NFTControllerArgs): Promise<StatusResult<string>> {
  return resultFormat<string>(await (await NFTCanisterController(true)).create(values));
}

export async function setCanisterLogo(canisterId: string, logo: string) {
  return resultFormat<boolean>(await (await NFTCanister(canisterId, true)).setLogo(logo));
}

export async function setCanisterLogoInController(canisterId: string, logo: string) {
  return resultFormat<boolean>(await (await NFTCanisterController(true)).setLogo(logo, canisterId));
}

export function useCanisterMetadata(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      if (OLD_CANISTER_IDS.includes(canisterId))
        return resultFormat<NFTControllerInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data;
      return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data;
    }, [canisterId]),
  );
}

export async function getCanisterLogo(canisterId: string) {
  // The there canisters doesn't has info method in canister
  if (OLD_CANISTER_IDS.includes(canisterId))
    return resultFormat<NFTControllerInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data?.image;
  return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data?.image;
}

export function useCanisterLogo(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getCanisterLogo(canisterId);
    }, [canisterId]),
  );
}

export function useCanisterNFTList(canisterId: string, principal: string | Null, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !principal || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<NFTTokenMetadata>>(
        await (
          await NFTCanister(canisterId)
        ).findTokenList({ principal: Principal.fromText(principal) }, BigInt(offset), BigInt(limit)),
      ).data;
    }, [canisterId, principal, offset, limit]),
  );
}

export function useNFTMintInfo() {
  return useCallsData(
    useCallback(async () => {
      return resultFormat<[bigint, bigint, string, string]>(await (await NFTCanisterController()).feeInfo()).data;
    }, []),
  );
}

export async function getSwapNFTStat() {
  return resultFormat<[bigint, bigint]>(await (await swapNFT()).getNftStat()).data;
}
