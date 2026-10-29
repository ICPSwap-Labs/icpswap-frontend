import { Flex } from "@icpswap/ui";
import { BigNumber } from "@icpswap/utils";
import { Box, ClickAwayListener, Typography } from "components/Mui";
import { useState } from "react";
import { useSlippageManager } from "store/swap/cache/hooks";

import { SwapSettingCard } from "./SwapSettings";

export interface SwapSettingsProps {
  type: string;
  position?: "right" | "left";
  ui?: "pro";
}

export function SwapSettings({ type, ui, position = "right" }: SwapSettingsProps) {
  const [settingShow, setSettingShow] = useState(false);
  const [slippageTolerance] = useSlippageManager(type);

  const hideSettingBox = () => {
    setSettingShow(false);
  };

  const handleToggleSettingShow = () => {
    setSettingShow(!settingShow);
  };

  return (
    <ClickAwayListener onClickAway={hideSettingBox}>
      <Box
        sx={{
          position: "relative",
          "& img": {
            cursor: "pointer",
          },
        }}
      >
        <Flex
          className={`swap-toolbar-control swap-settings-control${ui === "pro" ? " swap-settings-pro" : ""}`}
          gap="0 4px"
          onClick={handleToggleSettingShow}
          sx={{
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid var(--color-base-300)",
            height: ui === "pro" ? "auto" : "36px",
            background: ui === "pro" ? "var(--color-base-100)" : "transparent",
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "text.primary" }}>
            {new BigNumber(slippageTolerance).div(1000).toString()}%
          </Typography>

          <img src="/images/setting.svg" alt="" />
        </Flex>

        {settingShow && (
          <Box
            className="swap-settings-popover"
            sx={{
              position: "absolute",
              top: "42px",
              zIndex: 10,
              ...(position === "right" ? { right: 0 } : { left: 0 }),
            }}
          >
            <SwapSettingCard type={type} onClose={() => setSettingShow(false)} />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
