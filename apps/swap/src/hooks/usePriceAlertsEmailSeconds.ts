import { PRICE_ALERTS_EMAIL_SECOND } from "constants/price-alerts";
import { useEffect } from "react";
import { useEmailSecondManger, useShowGetCodeManager } from "store/price-alerts/hooks";

export function usePriceAlertsEmailSeconds() {
  const [showGetCode, setShowGetCode] = useShowGetCodeManager();
  const [second, setSecond] = useEmailSecondManger();

  useEffect(() => {
    let timer: number | null;

    function call() {
      if (showGetCode) return;

      let __second = second;

      timer = setInterval(() => {
        if (__second === 0) {
          if (timer) clearInterval(timer);
          timer = null;
          setSecond(PRICE_ALERTS_EMAIL_SECOND);
          setShowGetCode(true);
          return;
        }

        __second -= 1;
        setSecond(__second);
      }, 1000);
    }

    call();

    return () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
  }, [second, showGetCode, setSecond]);
}
