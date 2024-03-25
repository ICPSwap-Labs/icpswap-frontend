import { useMemo } from "react";

interface Token {
  fee: number;
  decimals: number;
  canisterId: string;
  name: string;
  standard: string;
  symbol: string;
}

let tokens: Token[] = [];

async function loadTokens() {
  try {
    tokens = (await import("../../.tokens.json")).default;
  } catch (err) {
    console.warn(err);
  }
}

loadTokens();

export function useLocalTokens() {
  return useMemo(() => tokens, [tokens]);
}
