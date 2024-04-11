import { useState, ReactNode } from "react";
import { Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory, useLocation } from "react-router-dom";
import { isDarkTheme, mockALinkAndOpen } from "utils";
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

export interface Tab {
  key: string | any;
  value: ReactNode;
  path?: string;
  link?: string;
}

export interface TabPanelProps {
  active?: string;
  tabs: Tab[];
  onChange?: (tab: Tab) => void;
}

export function TabPanel({ tabs, onChange, active }: TabPanelProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [activeButtonKey, setActiveButtonKey] = useState<null | string>(null);

  const loadPage = (tab: Tab) => {
    if (tab.link) {
      mockALinkAndOpen(tab.link, "toggle_link");
      return;
    }

    if (!tab.path) {
      setActiveButtonKey(tab.key);
      if (onChange) onChange(tab);
      return;
    }
    history.push(tab.path);
  };

  const isActive = (tab: Tab) => {
    if (tab.path) {
      if (tab.key === "/swap" || tab.key === "/swap/v2") {
        if (tab.key === location.pathname || `${tab.key}/` === location.pathname) return "active";
        return "";
      }
      return location.pathname.includes(tab.key);
    }
    if (active) return active === tab.key;
    if (!activeButtonKey) return tabs[0].key === tab.key;
    return activeButtonKey === tab.key;
  };

  return (
    <Grid container justifyContent="center">
      <Grid className={classes.switchBox} container>
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            className={`${classes.switchButton} ${isActive(tab) ? "active" : ""}`}
            onClick={() => loadPage(tab)}
          >
            <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
              {tab.value}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
}
