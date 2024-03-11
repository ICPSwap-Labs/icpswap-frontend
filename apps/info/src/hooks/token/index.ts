import { useMemo, useEffect, useState } from "react";
import { WRAPPED_ICP_TOKEN_INFO, ICP_TOKEN_INFO } from "constants/tokens";
import { TokenInfo, CacheTokenInfo } from "types/token";
import { getTokenBaseInfo } from "./useTokenInfo";
import { getTokenStandard, useStateTokenCapId, useUpdateTokenCapId } from "store/token/cache/hooks";
import store from "store/index";
import { getCapRootId } from "@icpswap/hooks";
import { IdbStorage } from "@icpswap/utils";
import { DB_NAME, DB_VERSION } from "constants/db";
import { TOKEN_STANDARD } from "@icpswap/constants";

const STORAGE_TIME_KEY = "STORAGE_TIME_KEY";
const STORAGE_EXPIRE_TIME = 1440 * 60 * 1000; // 10 minutes

const storage = new IdbStorage(DB_NAME, DB_VERSION, "tokens");

export async function getStorageInfo(tokenId: string) {
  const storageInfo = await storage.get(`TOKEN_${tokenId}`);
  if (storageInfo) return JSON.parse(storageInfo) as CacheTokenInfo;
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

export function getSwapTokenArgs(address: string) {
  const standards = store.getState().tokenCache.standards;
  let standard = standards[address] as string;
  if (address === WRAPPED_ICP_TOKEN_INFO.canisterId) standard = WRAPPED_ICP_TOKEN_INFO.standardType;
  if (!standard) throw Error(`No token standard: ${address}`);
  return { address: address, standard: standard as string };
}

export function useStorageInfo(tokenId: string | undefined) {
  const [storageInfo, setStorageInfo] = useState<null | undefined | CacheTokenInfo>(null);

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

function isStorageInfoValid(storageInfo: CacheTokenInfo | undefined): storageInfo is CacheTokenInfo {
  return !!storageInfo && storageInfo.decimals !== undefined && storageInfo.transFee !== undefined;
}

export function useTokenInfo(tokenId: string | undefined) {
  const _tokenId =
    tokenId === ICP_TOKEN_INFO.canisterId || tokenId === WRAPPED_ICP_TOKEN_INFO.canisterId ? undefined : tokenId;

  const [tokenInfo, setTokenInfo] = useState<CacheTokenInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const stateTokenCapId = useStateTokenCapId(_tokenId);
  const updateTokenCapId = useUpdateTokenCapId();

  useEffect(() => {
    async function call() {
      if (_tokenId) {
        setLoading(true);

        const storageInfo = await getStorageInfo(_tokenId);

        let getStorageInfoErrored = false;

        // Fix some user's wrong cache: transFee or some bigint is liked "bigint:5"
        try {
          if (storageInfo && isStorageInfoValid(storageInfo)) {
            setTokenInfo({
              ...storageInfo,
              transFee: BigInt(storageInfo.transFee?.toString() ?? 0),
              decimals: Number(storageInfo.decimals),
            });

            setLoading(false);
          }
        } catch (err) {
          getStorageInfoErrored = true;
          console.log(err);
        }

        if (
          !storageInfo ||
          getStorageInfoErrored ||
          isNeedUpdateTokenInfo(_tokenId) ||
          !isStorageInfoValid(storageInfo)
        ) {
          const tokenInfo = await getTokenBaseInfo(_tokenId);

          if (tokenInfo && !!tokenInfo?.symbol && !!tokenInfo.canisterId && !!String(tokenInfo.decimals)) {
            setStorageInfo(_tokenId, JSON.stringify(tokenInfo));
            setTokenInfo(tokenInfo);
            updateTokenStorageTime(_tokenId);
          }

          setLoading(false);
        }
      }
    }

    call();
  }, [_tokenId]);

  useEffect(() => {
    const call = async () => {
      const standard = getTokenStandard(_tokenId);

      if (!stateTokenCapId && _tokenId && standard === TOKEN_STANDARD.DIP20) {
        if (_tokenId === ICP_TOKEN_INFO.canisterId) return;
        const capId = await getCapRootId(_tokenId);
        updateTokenCapId({ canisterId: _tokenId, capId: capId?.toString() ?? "" });
      }
    };

    call();
  }, [stateTokenCapId, _tokenId]);

  return useMemo(() => {
    if (!tokenId) return { result: undefined, loading: false };
    if (tokenId === ICP_TOKEN_INFO.canisterId) return { loading: false, result: ICP_TOKEN_INFO };
    if (tokenId === WRAPPED_ICP_TOKEN_INFO.canisterId) return { loading: false, result: WRAPPED_ICP_TOKEN_INFO };

    if (!tokenInfo) {
      return {
        result: undefined,
        loading,
      };
    }

    return {
      result: tokenInfo as TokenInfo,
      loading,
    };
  }, [tokenInfo, loading, tokenId]);
}

export * from "./useTokenBalance";
export * from "./useTokens";
