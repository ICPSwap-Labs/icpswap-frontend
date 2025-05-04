import { useMemo, useEffect, useState, useCallback } from "react";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import type { TokenInfo, StorageTokenInfo, Null } from "@icpswap/types";
import { getTokenStandard } from "store/token/cache/hooks";
import { DB_NAME, DB_VERSION } from "constants/db";
import { BigNumber, IdbStorage } from "@icpswap/utils";
import { getPromisesAwait } from "@icpswap/hooks";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";

import { getTokenInfo } from "./calls";

const storage = new IdbStorage(DB_NAME, DB_VERSION, "tokens");

export async function getStorageTokenInfo(tokenId: string) {
  const storageInfo = await storage.get(`TOKEN_${tokenId}`);
  if (storageInfo) return JSON.parse(storageInfo) as StorageTokenInfo;
  return undefined;
}

export async function setStorageTokenInfo(tokenInfo: StorageTokenInfo) {
  await storage.set(`TOKEN_${tokenInfo.canisterId}`, JSON.stringify(tokenInfo));
}

function isStorageInfoValid(storageInfo: StorageTokenInfo | undefined): storageInfo is StorageTokenInfo {
  return !!storageInfo && storageInfo.decimals !== undefined && storageInfo.transFee !== undefined;
}

export async function __getTokenInfo(tokenId: string) {
  const storageInfo = await getStorageTokenInfo(tokenId);

  if (isStorageInfoValid(storageInfo)) {
    return storageInfo;
  }

  const baseTokenInfo = await getTokenInfo(tokenId);

  if (baseTokenInfo) {
    await setStorageTokenInfo({
      ...baseTokenInfo,
      totalSupply: "0",
      transFee: baseTokenInfo.transFee.toString(),
    });

    return baseTokenInfo as TokenInfo;
  }
}

export enum TokenInfoState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
}

export function useTokensInfo(tokenIds: (string | undefined | null)[]): [TokenInfoState, TokenInfo | undefined][] {
  const [tokenInfos, setTokenInfos] = useState<{ [id: string]: TokenInfo | undefined }>({});
  const [loadings, setLoadings] = useState<{ [id: string]: boolean }>({});

  const tokenIdsKey = useMemo(() => JSON.stringify(tokenIds), [tokenIds]);

  const fetch_token_info = useCallback(async (tokenId: string | undefined | null) => {
    if (!tokenId) return undefined;

    let tokeInfo: undefined | TokenInfo;

    if (tokenId === ICP_TOKEN_INFO.canisterId) tokeInfo = ICP_TOKEN_INFO;
    if (tokenId === WRAPPED_ICP_TOKEN_INFO.canisterId) tokeInfo = WRAPPED_ICP_TOKEN_INFO;

    if (tokeInfo) {
      setTokenInfos((prevState) => ({
        ...prevState,
        [tokenId]: tokeInfo,
      }));
      setLoadings((prevState) => ({
        ...prevState,
        [tokenId]: false,
      }));
      return;
    }

    setLoadings((prevState) => ({
      ...prevState,
      [tokenId]: true,
    }));

    const storageInfo = await getStorageTokenInfo(tokenId);

    let getStorageInfoErrored = false;

    // Fix some user's wrong cache: transFee or some bigint is liked "bigint:5"
    try {
      if (isStorageInfoValid(storageInfo)) {
        setTokenInfos((prevState) => ({
          ...prevState,
          [tokenId]: {
            name: storageInfo.name,
            logo: storageInfo.logo,
            symbol: storageInfo.symbol,
            canisterId: storageInfo.canisterId,
            totalSupply: BigInt(0),
            transFee: storageInfo.transFee.includes("bigint:")
              ? BigInt(storageInfo.transFee.replace(/\D/g, ""))
              : BigInt(new BigNumber(storageInfo.transFee).toString()),
            decimals: Number(storageInfo.decimals),
            standardType: storageInfo.standardType,
          },
        }));

        setLoadings((prevState) => ({
          ...prevState,
          [tokenId]: false,
        }));
      }
    } catch (err) {
      console.error(err);
      getStorageInfoErrored = true;
    }

    if (!storageInfo || !isStorageInfoValid(storageInfo) || getStorageInfoErrored) {
      const tokenInfo = await getTokenInfo(tokenId);

      if (tokenInfo) {
        await setStorageTokenInfo({
          ...tokenInfo,
          transFee: tokenInfo.transFee.toString(),
          totalSupply: "0",
        });

        // The token standard maybe changed in some case,
        // So get the standard from the storage to upgrade the token info
        const tokenStandard = getTokenStandard(tokenInfo.canisterId);

        setTokenInfos((prevState) => ({
          ...prevState,
          [tokenId]: {
            ...tokenInfo,
            transFee: BigInt(tokenInfo.transFee.toString()),
            decimals: Number(tokenInfo.decimals),
            standardType: tokenStandard ?? tokenInfo.standardType,
          },
        }));
      }
    }

    setLoadings((prevState) => ({
      ...prevState,
      [tokenId]: false,
    }));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function call() {
      try {
        const calls = tokenIds.map(async (tokenId) => await fetch_token_info(tokenId));
        await getPromisesAwait(calls, 20);
      } catch (error) {
        console.error("Failed to fetch token infos:", error);
      }
    }

    if (mounted) call();

    return () => {
      mounted = false;
    };
  }, [tokenIdsKey, fetch_token_info]);

  return useMemo(() => {
    return tokenIds.map((tokenId) => {
      if (!tokenId) return [TokenInfoState.INVALID, undefined];

      const tokenInfo = tokenInfos[tokenId];
      const loading = loadings[tokenId];

      if (loading) return [TokenInfoState.LOADING, undefined];
      if (!tokenInfo) return [TokenInfoState.INVALID, undefined];

      return [TokenInfoState.EXISTS, tokenInfo];
    });
  }, [tokenInfos, loadings, tokenIds]);
}

export function useTokenInfo(tokenId: string | Null) {
  const [state, tokenInfo] = useTokensInfo([tokenId])[0];

  return useMemo(() => {
    if (!tokenInfo) {
      return {
        result: undefined,
        loading: state === TokenInfoState.LOADING,
      };
    }

    return {
      result: tokenInfo as TokenInfo,
      loading: state === TokenInfoState.LOADING,
    };
  }, [tokenInfo, state]);
}
