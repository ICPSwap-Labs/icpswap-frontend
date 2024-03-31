import { useState } from "react";
import { Box, ClickAwayListener } from "@mui/material";
import { useTheme } from "@mui/styles";
import SettingIcon from "assets/images/swap/setting";
import UserSetting from "components/swap/UserSetting";
import { isDarkTheme } from "utils";

export interface SwapSettingsProps {
  type: string;
  position?: "right" | "left";
}

export default function SwapSettingIcon({ type, position = "right" }: SwapSettingsProps) {
  const theme = useTheme();
  const [settingShow, setSettingShow] = useState(false);

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
        <SettingIcon
          onClick={handleToggleSettingShow}
          sx={{
            color: "transparent",
            cursor: "pointer",
          }}
          strokeColor={isDarkTheme(theme) ? "#BDC8F0" : undefined}
        />

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
