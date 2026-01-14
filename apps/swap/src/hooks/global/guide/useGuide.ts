import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useWalletIsConnected } from "store/auth/hooks";
import { getGuideAtomValue } from "hooks/global/guide/config";
import { useLocation } from "react-router-dom";

export function useGuideManager(guideName: string) {
  const atom = getGuideAtomValue(guideName);
  return useAtom(atom);
}

export function useGuideIsRead(guideName: string) {
  const atom = getGuideAtomValue(guideName);
  return useAtomValue(atom);
}

export function useGuideReadCallback(guideName: string) {
  const [, setIsRead] = useGuideManager(guideName);

  return useCallback(() => {
    setIsRead(true);
  }, [setIsRead, guideName]);
}

export function useShowGuideModalManager(guideName: string, selfGuideShow = true) {
  const [open, setOpen] = useState(true);
  const isRead = useGuideIsRead(guideName);
  const isConnected = useWalletIsConnected();
  const location = useLocation();

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const show = useMemo(() => {
    return !isRead && open && isConnected && selfGuideShow;
  }, [isConnected, open, isRead, selfGuideShow]);

  // Reset open state on route change for re-showing the guide modal if user close it manually
  useEffect(() => {
    setOpen(true);
  }, [location.pathname]);

  return useMemo(() => ({ show, onClose }), [show, onClose]);
}
