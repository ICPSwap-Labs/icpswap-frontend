import { getGuideAtomValue } from "hooks/global/guide/config";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useWalletIsConnected } from "store/auth/hooks";

export function useGuideManager(guideName: string) {
  const atom = getGuideAtomValue(guideName);
  return useAtom(atom);
}

export function useGuideIsRead(guideName: string) {
  const atom = getGuideAtomValue(guideName);
  return useAtomValue(atom);
}

export function useShowGuideModalManager(guideName: string, selfGuideShow = true) {
  const [open, setOpen] = useState(true);
  const isRead = useGuideIsRead(guideName);
  const isConnected = useWalletIsConnected();
  const location = useLocation();
  const [, setIsRead] = useGuideManager(guideName);

  const onClose = useCallback(() => {
    setOpen(false);
    setIsRead(true);
  }, [setOpen, setIsRead]);

  const show = useMemo(() => {
    return !isRead && open && isConnected && selfGuideShow;
  }, [isConnected, open, isRead, selfGuideShow]);

  // Reset open state on route change for re-showing the guide modal if user close it manually
  useEffect(() => {
    setOpen(true);
  }, [location.pathname]);

  const read = useCallback(() => {
    setIsRead(true);
  }, [setIsRead, guideName]);

  return useMemo(() => ({ show, onClose, read }), [show, onClose, read]);
}
