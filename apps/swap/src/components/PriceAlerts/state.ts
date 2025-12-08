import { atom, useAtom } from "jotai";
import { UseQueryResult } from "@tanstack/react-query";
import { AlertInfo } from "@icpswap/candid";

const showEmailAtom = atom<boolean>(false);
const resetEmailAtom = atom<boolean>(false);
const alertsOpenAtom = atom<boolean>(false);
const alertsRefetch = atom<UseQueryResult<AlertInfo[], Error> | undefined>(undefined);

export function useShowEmailManager() {
  return useAtom(showEmailAtom);
}

export function useResetEmailManager() {
  return useAtom(resetEmailAtom);
}

export function useAlertsOpenManager() {
  return useAtom(alertsOpenAtom);
}

export function useAlertsRefetchManager() {
  return useAtom(alertsRefetch);
}
