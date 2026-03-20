import type { TokensTreeMapRow } from "@icpswap/types";
import { atom, useAtom, useAtomValue } from "jotai";

const tokensAtom = atom<Array<TokensTreeMapRow>>([]);

export function useTokensManager() {
  return useAtom(tokensAtom);
}

export function useTokens() {
  return useAtomValue(tokensAtom);
}
