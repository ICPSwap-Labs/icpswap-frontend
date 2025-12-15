import { useCallback, useEffect, useState } from "react";
import { BeginnerGuideUI } from "components/BeginnerGuide/BeginnerGuideUI";
import storage from "redux-persist/lib/storage";
import { useLocation } from "react-router-dom";

export const LIQUIDITY_GUIDE_NAME = "liquidity_guide_name";

export async function getLiquidityGuideStorage() {
  const storageValue = await storage.getItem(LIQUIDITY_GUIDE_NAME);
  const isRead = !storageValue ? "" : JSON.parse(storageValue);
  return isRead;
}

export async function setLiquidityGuideStorage(isRead: boolean) {
  await storage.setItem(LIQUIDITY_GUIDE_NAME, JSON.stringify(isRead));
}

const Guides = [
  {
    step: 0,
    title: "Add liquidity - earn trading fees from swaps",
    image: "/images/beginner-guide/liquidity-step-0.png",
  },
  {
    step: 1,
    title: "Manage your liquidity anytime",
    image: "/images/beginner-guide/liquidity-step-1.png",
  },
  {
    step: 2,
    title: "Explore top pools - find high-yield opportunities",
    image: "/images/beginner-guide/liquidity-step-2.png",
  },
];

export function LiquidityGuide() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function call() {
      const isRead = await getLiquidityGuideStorage();
      if (isRead === "true" || isRead === true) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }

    if (location.pathname.startsWith("/liquidity")) {
      call();
    }
  }, [location]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleGotIt = useCallback(() => {
    setLiquidityGuideStorage(true);
    setOpen(false);
  }, [setOpen]);

  return open ? <BeginnerGuideUI open={open} onClose={handleClose} guides={Guides} onGotIt={handleGotIt} /> : null;
}
