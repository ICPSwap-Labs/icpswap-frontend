import { useState, useEffect } from "react";
import { useSettingGlobalAds } from "@icpswap/hooks";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";

import { AdsUI } from "./UI";

export function Ads() {
  const [globalAdsShow, setGlobalAdsShow] = useState<boolean>(true);
  const [globalAdsContent, setGlobalAdsContent] = useState<string | undefined>(undefined);
  const [globalAdsLink, setGlobalAdsLink] = useState<string | undefined>(undefined);
  const [globalAdsButtonText, setGlobalAdsButtonText] = useState<string | undefined>(undefined);

  const { result: globalAds } = useSettingGlobalAds();

  useEffect(() => {
    if (globalAds) {
      setGlobalAdsContent(globalAds.content !== "" ? globalAds.content : undefined);
      setGlobalAdsLink(globalAds.url !== "" ? globalAds.url : undefined);
      setGlobalAdsButtonText(globalAds.button_name !== "" ? globalAds.button_name : undefined);
    }
  }, [globalAds]);

  return nonUndefinedOrNull(globalAdsContent) && globalAdsShow ? (
    <Flex
      fullWidth
      sx={{
        position: "sticky",
        top: 0,
        height: "48px",
        zIndex: 1000,
      }}
    >
      <AdsUI
        content={globalAdsContent}
        link={globalAdsLink}
        button_name={globalAdsButtonText}
        onClose={() => setGlobalAdsShow(false)}
      />
    </Flex>
  ) : null;
}
