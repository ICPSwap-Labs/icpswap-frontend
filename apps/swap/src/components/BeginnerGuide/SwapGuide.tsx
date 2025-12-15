import { useCallback, useEffect, useState } from "react";
import { BeginnerGuideUI } from "components/BeginnerGuide/BeginnerGuideUI";
import storage from "redux-persist/lib/storage";

export const SWAP_GUIDE_NAME = "swap_guide_name";

export async function getSwapGuideStorage() {
  const storageValue = await storage.getItem(SWAP_GUIDE_NAME);
  const isRead = !storageValue ? "" : JSON.parse(storageValue);
  return isRead;
}

export async function setSwapGuideStorage(isRead: boolean) {
  await storage.setItem(SWAP_GUIDE_NAME, JSON.stringify(isRead));
}

const Guides = [
  {
    step: 0,
    title: "Start your swap",
    image: "/images/beginner-guide/swap-step-0.png",
  },
  {
    step: 1,
    title: "Select tokens",
    image: "/images/beginner-guide/swap-step-1.png",
  },
  {
    step: 2,
    title: "Enter amount",
    image: "/images/beginner-guide/swap-step-2.png",
  },
  {
    step: 3,
    title: "Confirm swap",
    image: "/images/beginner-guide/swap-step-3.png",
  },
  {
    step: 4,
    title: "Limit - Set your own price to buy or sell",
    image: "/images/beginner-guide/swap-step-4.png",
  },
  {
    step: 5,
    title: "Switch to Pro Modal for advanced trading pools",
    image: "/images/beginner-guide/swap-step-5.png",
  },
];

export function SwapGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function call() {
      const isRead = await getSwapGuideStorage();
      if (isRead === "true" || isRead === true) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }

    call();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleGotIt = useCallback(() => {
    setSwapGuideStorage(true);
    setOpen(false);
  }, [setOpen]);

  return open ? <BeginnerGuideUI open={open} onClose={handleClose} guides={Guides} onGotIt={handleGotIt} /> : null;
}
