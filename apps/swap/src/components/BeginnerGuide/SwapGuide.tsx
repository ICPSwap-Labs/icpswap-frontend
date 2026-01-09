import { BeginnerGuideUI } from "components/BeginnerGuide/BeginnerGuideUI";
import { useGuideReadCallback, useShowGuideModalManager, SwapGuideName } from "hooks/global/guide";

const Guides = [
  {
    step: 0,
    title: "Start your swap",
  },
  {
    step: 1,
    title: "Select tokens",
  },
  {
    step: 2,
    title: "Enter amount",
  },
  {
    step: 3,
    title: "Confirm swap",
  },
  {
    step: 4,
    title: "Limit - Set your own price to buy or sell",
  },
  {
    step: 5,
    title: "Switch to Pro mode for charts and market data",
  },
].map((element) => ({ ...element, image: `/images/beginner-guide/swap/${element.step + 1}.png` }));

export function SwapGuide() {
  const { show, onClose } = useShowGuideModalManager(SwapGuideName);
  const read = useGuideReadCallback(SwapGuideName);

  return show ? <BeginnerGuideUI open onClose={onClose} guides={Guides} onGotIt={read} /> : null;
}
