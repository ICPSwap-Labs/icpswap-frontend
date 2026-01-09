import { BeginnerGuideUI } from "components/BeginnerGuide/BeginnerGuideUI";
import { useShowGuideModalManager, useGuideReadCallback, LiquidityGuideName } from "hooks/global/guide";
import { useLiquidityGuideShow } from "hooks/global/guide/useLiquidityGuide";

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
  const liquidityGuideShow = useLiquidityGuideShow();

  const { show, onClose } = useShowGuideModalManager(LiquidityGuideName, liquidityGuideShow);
  const read = useGuideReadCallback(LiquidityGuideName);

  return show ? <BeginnerGuideUI open onClose={onClose} guides={Guides} onGotIt={read} /> : null;
}
