import { useMemo, useEffect, useState } from "react";
import { WRAPPED_ICP_TOKEN_INFO, ICP_TOKEN_INFO } from "@icpswap/tokens";
import { TokenInfo } from "types/token";
import { getTokenStandard } from "store/token/cache/hooks";
import { getPromisesAwait } from "@icpswap/hooks";
import { IdbStorage } from "@icpswap/utils";
import { DB_NAME, DB_VERSION } from "constants/db";
import { TOKEN_STANDARD } from "@icpswap/constants";
import TokenDefaultLogo from "assets/images/Token_default_logo.png";
import { getTokenBaseInfo } from "./info-calls";
import { useLocalTokens } from "./useLocalTokens";

const STORAGE_TIME_KEY = "STORAGE_TIME_KEY";
const STORAGE_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;

const storage = new IdbStorage(DB_NAME, DB_VERSION, "tokens");

export async function getStorageInfo(tokenId: string) {
  const storageInfo = await storage.get(`TOKEN_${tokenId}`);
  if (storageInfo) return JSON.parse(storageInfo) as TokenInfo;
  return undefined;
}

export async function setStorageInfo(tokenId: string, logo: string) {
  await storage.set(`TOKEN_${tokenId}`, logo);
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

export function useStorageInfo(tokenId: string | undefined) {
  const [storageInfo, setStorageInfo] = useState<null | undefined | TokenInfo>(null);

  useEffect(() => {
    async function call() {
      if (tokenId) {
        const info = await getStorageInfo(tokenId);
        setStorageInfo(info);
      }
    }

    call();
  }, [tokenId]);

  return useMemo(() => storageInfo, [storageInfo]);
}

function isStorageInfoValid(storageInfo: TokenInfo | undefined): storageInfo is TokenInfo {
  return !!storageInfo && storageInfo.decimals !== undefined && storageInfo.transFee !== undefined;
}

let get_tokens_info_index = 0;

export enum TokenInfoState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
}

export function useTokensInfo(
  tokenIds: (string | null | undefined)[] | undefined,
): [TokenInfoState, TokenInfo | undefined][] {
  const [tokenInfos, setTokenInfos] = useState<{ [id: string]: TokenInfo | undefined }>({});
  const [loadings, setLoadings] = useState<{ [id: string]: boolean }>({});

  const localTokens = useLocalTokens();

  const fetch_token_info = async (tokenId: string | undefined | null, call_index: number) => {
    if (!tokenId) return;

    if (call_index !== get_tokens_info_index) {
      return;
    }

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
          canisterId: localToken.canisterId,
          name: localToken.name,
          symbol: localToken.symbol,
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

    const storageInfo = await getStorageInfo(tokenId);

    let getStorageInfoErrored = false;

    // Fix some user's wrong cache: transFee or some bigint is liked "bigint:5"
    try {
      if (isStorageInfoValid(storageInfo)) {
        setTokenInfos((prevState) => ({
          ...prevState,
          [tokenId]: {
            ...storageInfo,
            transFee: BigInt(storageInfo.transFee.toString()),
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
      console.error("UseTokenInfo set storage info error:", err);
      getStorageInfoErrored = true;
    }

    if (!storageInfo || isNeedUpdateTokenInfo(tokenId) || !isStorageInfoValid(storageInfo) || getStorageInfoErrored) {
      const tokenInfo = await getTokenBaseInfo(tokenId);

      if (tokenInfo) {
        await setStorageInfo(tokenId, JSON.stringify(tokenInfo));
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
      if (tokenIds) {
        get_tokens_info_index++;
        const new_call_index = get_tokens_info_index;
        const calls = tokenIds.map(async (tokenId) => await fetch_token_info(tokenId, new_call_index));
        getPromisesAwait(calls, 10);
      }
    }

    call();
  }, [JSON.stringify(tokenIds)]);

  return useMemo(() => {
    if (!tokenIds) return [];

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
