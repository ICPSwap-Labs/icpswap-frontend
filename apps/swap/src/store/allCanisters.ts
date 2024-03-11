import storage from "redux-persist/lib/storage";

const KEY = "ICPSwap-all-canisters";

export async function getAllCanisters() {
  const allCanisters = await storage.getItem(KEY);
  return allCanisters?.split(",");
}

export async function setAllCanisters(canisterIds: string[]) {
  const storageAllCanisters = await getAllCanisters();

  const allCanisters = [...(storageAllCanisters ?? []), ...canisterIds];

  await storage.setItem(KEY, [...new Set(allCanisters)].join(","));
}

export async function updateCanisters(canisterIds: string[]) {
  await setAllCanisters(canisterIds);
}
