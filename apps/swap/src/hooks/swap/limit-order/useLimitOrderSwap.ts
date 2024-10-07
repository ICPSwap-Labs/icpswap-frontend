import { useCallback, useState } from "react";
import { Null } from "@icpswap/types";

export function useLimitOrderSwap() {
  const [orderPrice, setOrderPrice] = useState<string | Null>(null);

  const handleInputOrderPrice = useCallback(
    (price: string) => {
      setOrderPrice(price);
    },
    [setOrderPrice],
  );

  return {
    handleInputOrderPrice,
    orderPrice,
  };
}
