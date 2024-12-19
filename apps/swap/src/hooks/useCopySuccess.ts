import { useCallback } from "react";
import { t } from "@lingui/macro";

import { useTips, MessageTypes } from "./useTips";

export function useCopySuccess() {
  const [openTip] = useTips();

  return useCallback(() => {
    openTip(t`Copy success`, MessageTypes.success);
  }, []);
}
