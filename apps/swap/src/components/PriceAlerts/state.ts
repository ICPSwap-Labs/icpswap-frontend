import { atom, useAtom } from "jotai";

const showEmailAtom = atom<boolean>(false);
const resetEmailAtom = atom<boolean>(false);
const alertsOpenAtom = atom<boolean>(false);

export function useShowEmailManager() {
  return useAtom(showEmailAtom);
}

export function useResetEmailManager() {
  return useAtom(resetEmailAtom);
}

export function useAlertsOpenManager() {
  return useAtom(alertsOpenAtom);
}
