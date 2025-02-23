import { useState } from "react";
import { Box, ClickAwayListener, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useSlippageManager } from "store/swap/cache/hooks";
import { BigNumber } from "@icpswap/utils";

import { SwapSettingCard } from "./SwapSettings";

export interface SwapSettingsProps {
  type: string;
  position?: "right" | "left";
  ui?: "pro";
}

export function SwapSettings({ type, ui, position = "right" }: SwapSettingsProps) {
  const theme = useTheme();
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
          gap="0 4px"
          onClick={handleToggleSettingShow}
          sx={{
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "40px",
            height: ui === "pro" ? "auto" : "32px",
            background: ui === "pro" ? theme.palette.background.level1 : theme.palette.background.level2,
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "text.primary" }}>
            {new BigNumber(slippageTolerance).div(1000).toString()}%
          </Typography>

          <img src="/images/setting.svg" alt="" />
        </Flex>

        {settingShow && (
          <Box
            sx={{
              position: "absolute",
              top: "30px",
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
