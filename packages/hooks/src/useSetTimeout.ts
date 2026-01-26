import { useCallback, useEffect } from "react";

export function useSetTimeout(call: () => void, time: number) {
  useEffect(() => {
    let timer = setTimeout(() => {
      call();
    }, time);

    return () => {
      clearTimeout(timer);
      timer = null;
    };
  }, [call, time]);
}

export function useSetTimeoutCall(call: () => void, time: number) {
  return useCallback(() => {
    let timer = setTimeout(() => {
      call();

      clearTimeout(timer);
      timer = null;
    }, time);
  }, [call, time]);
}
