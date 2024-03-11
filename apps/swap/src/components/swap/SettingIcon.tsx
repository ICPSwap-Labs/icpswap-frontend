import { useState } from "react";
import { Box, ClickAwayListener } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import SettingIcon from "assets/images/swap/setting";
import UserSetting from "components/swap/UserSetting";
import { isDarkTheme } from "utils";

const useStyles = makeStyles(() => {
  return {
    settingBox: {
      position: "relative",
      "& img": {
        cursor: "pointer",
      },
    },
    userSetting: {
      position: "absolute",
      right: 0,
      top: "30px",
      zIndex: 1,
    },
  };
});

export default function SwapSettingIcon({ type }: { type: string }) {
  const classes = useStyles();
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
      <Box className={classes.settingBox}>
        <SettingIcon
          onClick={handleToggleSettingShow}
          sx={{
            color: "transparent",
            cursor: "pointer",
          }}
          strokeColor={isDarkTheme(theme) ? "#BDC8F0" : undefined}
        />
        {settingShow && (
          <Box className={classes.userSetting}>
            <UserSetting type={type} onClose={() => setSettingShow(false)} />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
