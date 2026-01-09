import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useLiquidityGuideShow() {
  const location = useLocation();

  return useMemo(() => {
    return location.pathname.startsWith("/liquidity");
  }, [location]);
}
