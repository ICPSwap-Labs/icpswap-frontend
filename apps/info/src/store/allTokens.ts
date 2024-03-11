import { isValidPrincipal } from "@icpswap/utils";
import storage from "redux-persist/lib/storage";

const KEY = "ALL_TOKENS";

export async function getAllTokens() {
  const allTokens = await storage.getItem(KEY);
  return allTokens?.split(",").filter((ele) => !!ele && isValidPrincipal(ele));
}

export async function setAllTokens(canisterIds: string[]) {
  const storageAllTokens = await getAllTokens();

  const AllTokens = [...(storageAllTokens ?? []), ...canisterIds];

  await storage.setItem(KEY, [...new Set(AllTokens)].join(","));
}

export async function updateTokens(canisterIds: string[]) {
  await setAllTokens(canisterIds);
}
