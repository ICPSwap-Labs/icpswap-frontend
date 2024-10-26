import { useState } from "react";
import { Box, ClickAwayListener, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import SettingIcon from "assets/images/swap/setting";
import UserSetting from "components/swap/UserSetting";
import { Flex } from "@icpswap/ui";
import { isDarkTheme } from "utils";
import { Trans, t } from "@lingui/macro";
import { useSlippageManager } from "store/swap/cache/hooks";
import { BigNumber } from "bignumber.js";
import { Tooltip } from "components/index";

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
        <Flex gap="0 4px">
          <Tooltip
            tips={t`In DEX trading, multiple swaps may occur simultaneously. Allowing some slippage can help ensure successful trades within price fluctuations. However, to prevent potential 'sandwich attacks' by BOTs in your trade, you might consider setting slippage to 0. This ensures your trade executes at the expected price. If a sandwich attack occurs (or simultaneous swaps happen), your trade will fail, preventing any loss, and you can Reclaim your token`}
          />

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
