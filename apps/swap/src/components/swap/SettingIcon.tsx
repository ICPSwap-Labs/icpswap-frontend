import { useState } from "react";
import { Box, ClickAwayListener, Typography, useTheme } from "components/Mui";
import UserSetting from "components/swap/UserSetting";
import { Flex } from "@icpswap/ui";
import { useSlippageManager } from "store/swap/cache/hooks";
import { BigNumber } from "@icpswap/utils";

export interface SwapSettingsProps {
  type: string;
  position?: "right" | "left";
  ui?: "pro";
}

export default function SwapSettingIcon({ type, ui, position = "right" }: SwapSettingsProps) {
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
            background: ui === "pro" ? theme.palette.background.level1 : theme.palette.background.level3,
          }}
        >
          <Typography sx={{ fontSize: "12px" }}>{new BigNumber(slippageTolerance).div(1000).toString()}%</Typography>

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
            <UserSetting type={type} onClose={() => setSettingShow(false)} />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
