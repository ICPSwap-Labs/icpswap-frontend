import { memo, useState, ReactNode } from "react";
import { Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory, useLocation } from "react-router-dom";
import { isDarkTheme, mockALinkToOpen } from "utils";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    switchBox: {
      width: "auto",
      backgroundColor: isDarkTheme(theme) ? theme.colors.darkLevel1 : theme.colors.lightGray200,
      borderRadius: "15px",
      padding: "4px",
    },
    switchButton: {
      minWidth: "90px",
      padding: "0 20px",
      height: "45px",
      color: theme.themeOption.textSecondary,
      cursor: "pointer",
      borderRadius: "12px",
      fontWeight: 600,
      "&.active": {
        color: theme.themeOption.textPrimary,
        background: isDarkTheme(theme) ? theme.colors.darkLevel3 : "#ffffff",
      },
      "@media (max-width: 640px)": {
        minWidth: "76px",
        padding: "0 15px",
        fontSize: "12px",
      },
    },
  };
});

export interface ToggleButton {
  key: string | any;
  value: ReactNode;
  path?: string;
  link?: string;
}

export default memo(
  ({
    buttons,
    onChange = () => {},
    active,
  }: {
    active?: string;
    buttons: ToggleButton[];
    onChange?: (button: ToggleButton) => void;
  }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const [activeButtonKey, setActiveButtonKey] = useState<null | string>(null);

    const loadPage = (button: ToggleButton) => {
      if (button.link) {
        mockALinkToOpen(button.link, "toggle_link");
        return;
      }

      if (!button.path) {
        setActiveButtonKey(button.key);
        if (onChange) onChange(button);
        return;
      }
      history.push(button.path);
    };

    const isActive = (button: ToggleButton) => {
      if (button.path) {
        if (button.key === "/swap" || button.key === "/swap/v2") {
          if (button.key === location.pathname || `${button.key}/` === location.pathname) return "active";
          return "";
        }
        return location.pathname.includes(button.key);
      } else {
        if (!!active) return active === button["key"];
        if (!activeButtonKey) return buttons[0]["key"] === button.key;
        return activeButtonKey === button.key;
      }
    };

    return (
      <Grid container justifyContent="center">
        <Grid className={classes.switchBox} container>
          {buttons.map((item) => (
            <Box
              key={item.key}
              className={`${classes.switchButton} ${isActive(item) ? "active" : ""}`}
              onClick={() => loadPage(item)}
            >
              <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                {item.value}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    );
  },
);
