import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useTips, MessageTypes } from "./useTips";

export function useCopySuccess() {
  const { t } = useTranslation();
  const [openTip] = useTips();

  return useCallback(() => {
    openTip(t("common.copy.success"), MessageTypes.success);
  }, []);
}
