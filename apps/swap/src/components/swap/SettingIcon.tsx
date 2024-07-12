import { useState } from "react";
import { Box, ClickAwayListener, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import SettingIcon from "assets/images/swap/setting";
import UserSetting from "components/swap/UserSetting";
import { Flex } from "@icpswap/ui";
import { isDarkTheme } from "utils";
import { Trans } from "@lingui/macro";
import { useSlippageManager } from "store/swap/cache/hooks";
import { BigNumber } from "bignumber.js";

export interface SwapSettingsProps {
  type: string;
  position?: "right" | "left";
}

export default function SwapSettingIcon({ type, position = "right" }: SwapSettingsProps) {
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
        <Flex gap="0 8px">
          <Typography sx={{ fontSize: "12px" }}>
            <Trans>{new BigNumber(slippageTolerance).div(1000).toString()}% Slippage</Trans>
          </Typography>
          <SettingIcon
            onClick={handleToggleSettingShow}
            sx={{
              color: "transparent",
              cursor: "pointer",
            }}
            strokeColor={isDarkTheme(theme) ? "#ffffff" : undefined}
          />
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
