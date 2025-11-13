import { atom, useAtom } from "jotai";

const showEmailAtom = atom<boolean>(false);

export function useShowEmailManager() {
  return useAtom(showEmailAtom);
}
