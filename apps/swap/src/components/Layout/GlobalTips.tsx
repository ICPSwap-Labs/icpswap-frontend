import { useState, useEffect } from "react";
import { GlobalTips as GlobalTipsUI } from "@icpswap/ui";
import { useSettingGlobalTips } from "@icpswap/hooks";
import { nonUndefinedOrNull } from "@icpswap/utils";

export function GlobalTips() {
  const [globalTipsShow, setGlobalTipsShow] = useState<boolean>(true);
  const [globalTipsContent, setGlobalTipsContent] = useState<string | undefined>(undefined);
  const [globalTipsLink, setGlobalTipsLink] = useState<string | undefined>(undefined);

  const { result: globalTips } = useSettingGlobalTips();

  useEffect(() => {
    if (globalTips) {
      setGlobalTipsContent(globalTips.content !== "" ? globalTips.content : undefined);
      setGlobalTipsLink(globalTips.url !== "" ? globalTips.url : undefined);
    }
  }, [globalTips]);

  return nonUndefinedOrNull(globalTipsContent) && globalTipsShow ? (
    <GlobalTipsUI content={globalTipsContent} link={globalTipsLink} onClose={() => setGlobalTipsShow(false)} />
  ) : null;
}
