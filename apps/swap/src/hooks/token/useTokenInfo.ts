import { useMemo, useEffect, useState } from "react";
import { ICP_TOKEN_INFO, TOKEN_STANDARD, WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import type { TokenInfo, StorageTokenInfo } from "@icpswap/types";
import { getTokenStandard } from "store/token/cache/hooks";
import { DB_NAME, DB_VERSION } from "constants/db";
import { IdbStorage } from "@icpswap/utils";
import TokenDefaultLogo from "assets/images/Token_default_logo.png";
import { getPromisesAwait } from "@icpswap/hooks";
import { useLocalTokens } from "./useLocalTokens";
import { getTokenInfo } from "./calls";

const STORAGE_TIME_KEY = "STORAGE_TIME_KEY";
const STORAGE_EXPIRE_TIME = 2 * 60 * 60 * 1000; // millisecond

const storage = new IdbStorage(DB_NAME, DB_VERSION, "tokens");

async function getStorageTokenInfo(tokenId: string) {
  const storageInfo = await storage.get(`TOKEN_${tokenId}`);
  if (storageInfo) return JSON.parse(storageInfo) as StorageTokenInfo;
  return undefined;
}

async function setStorageTokenInfo(tokenInfo: StorageTokenInfo) {
  await storage.set(`TOKEN_${tokenInfo.canisterId}`, JSON.stringify(tokenInfo));
}

export function getTokenStorageTime(tokenId: string) {
  const val = window.localStorage.getItem(STORAGE_TIME_KEY);
  if (!val) return null;
  return (JSON.parse(val) as { [tokenId: string]: string })[tokenId] ?? null;
}

export function updateTokenStorageTime(tokenId: string) {
  const time = new Date().getTime();
  const val = window.localStorage.getItem(STORAGE_TIME_KEY);

  if (!val) {
    window.localStorage.setItem(STORAGE_TIME_KEY, JSON.stringify({ [tokenId]: time.toString() }));
  } else {
    const new_val = JSON.parse(val) as { [tokenId: string]: string };
    new_val[tokenId] = time.toString();

    window.localStorage.setItem(STORAGE_TIME_KEY, JSON.stringify(new_val));
  }
}

function isNeedUpdateTokenInfo(tokenId: string) {
  const storage_time = getTokenStorageTime(tokenId);
  if (!storage_time) return true;
  return new Date().getTime() - Number(storage_time) > STORAGE_EXPIRE_TIME;
}

function isStorageInfoValid(storageInfo: StorageTokenInfo | undefined): storageInfo is StorageTokenInfo {
  return !!storageInfo && storageInfo.decimals !== undefined && storageInfo.transFee !== undefined;
}

export async function _getTokenInfo(tokenId: string) {
  const storageInfo = await getStorageTokenInfo(tokenId);

  if (isStorageInfoValid(storageInfo) && !isNeedUpdateTokenInfo(tokenId)) {
    return storageInfo;
  }

  const baseTokenInfo = await getTokenInfo(tokenId);

  if (baseTokenInfo) {
    await setStorageTokenInfo({
      ...baseTokenInfo,
      totalSupply: "0",
      transFee: baseTokenInfo.transFee.toString(),
    });
    updateTokenStorageTime(tokenId);
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

  const localTokens = useLocalTokens();

  const fetch_token_info = async (tokenId: string | undefined | null) => {
    if (!tokenId) return;

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

    const localToken = localTokens.find((e) => e.canisterId === tokenId);

    if (localToken) {
      setTokenInfos((prevState) => ({
        ...prevState,
        [tokenId]: {
          ...localToken,
          logo: TokenDefaultLogo,
          transFee: BigInt(localToken.fee),
          decimals: Number(localToken.decimals),
          standardType: localToken.standard as TOKEN_STANDARD,
          totalSupply: BigInt(0),
        },
      }));

      setLoadings((prevState) => ({
        ...prevState,
        [tokenId]: false,
      }));
    }

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
              : BigInt(storageInfo.transFee.toString()),
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

    if (!storageInfo || isNeedUpdateTokenInfo(tokenId) || !isStorageInfoValid(storageInfo) || getStorageInfoErrored) {
      const tokenInfo = await getTokenInfo(tokenId);

      if (tokenInfo) {
        await setStorageTokenInfo({
          ...tokenInfo,
          transFee: tokenInfo.transFee.toString(),
          totalSupply: "0",
        });
        updateTokenStorageTime(tokenId);

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
  };

  useEffect(() => {
    async function call() {
      const calls = tokenIds.map(async (tokenId) => await fetch_token_info(tokenId));
      getPromisesAwait(calls, 20);
    }

    call();
  }, [JSON.stringify(tokenIds)]);

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

export function useTokenInfo(tokenId: string | undefined) {
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
