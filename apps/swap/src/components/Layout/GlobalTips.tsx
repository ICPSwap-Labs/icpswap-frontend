import { useSettingGlobalTips } from "@icpswap/hooks";
import { GlobalTips as GlobalTipsUI } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useEffect, useState } from "react";

export function GlobalTips() {
  const [globalTipsShow, setGlobalTipsShow] = useState<boolean>(true);
  const [globalTipsContent, setGlobalTipsContent] = useState<string | undefined>(undefined);
  const [globalTipsLink, setGlobalTipsLink] = useState<string | undefined>(undefined);

  const { data: globalTips } = useSettingGlobalTips();

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
