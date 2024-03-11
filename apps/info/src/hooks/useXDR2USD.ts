import { useXDR2USD } from "@icpswap/hooks";
import { useEffect } from "react";
import { useUpdateXDR2USD } from "store/global/hooks";

export function useInitialXDR2USD() {
  const { result: xdr_usdt } = useXDR2USD();
  const updateXDR2USD = useUpdateXDR2USD();

  useEffect(() => {
    if (xdr_usdt && !isNaN(Number(xdr_usdt))) {
      updateXDR2USD(Number(xdr_usdt));
    }
  }, [xdr_usdt, updateXDR2USD]);
}
