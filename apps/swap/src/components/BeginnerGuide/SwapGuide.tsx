import { BeginnerGuideUI } from "components/BeginnerGuide/BeginnerGuideUI";
import { useGuideReadCallback, useShowGuideModalManager, SwapGuideName } from "hooks/global/guide";

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
    title: "Switch to Pro mode for charts and market data",
    image: "/images/beginner-guide/swap-step-5.png",
  },
];

export function SwapGuide() {
  const { show, onClose } = useShowGuideModalManager(SwapGuideName);
  const read = useGuideReadCallback(SwapGuideName);

  return show ? <BeginnerGuideUI open onClose={onClose} guides={Guides} onGotIt={read} /> : null;
}
