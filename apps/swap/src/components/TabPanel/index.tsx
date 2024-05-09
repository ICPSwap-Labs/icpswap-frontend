import { useState, ReactNode } from "react";
import { Grid, Box, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory, useLocation } from "react-router-dom";
import { mockALinkAndOpen } from "utils";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
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
      },
      "&.fontNormal": {
        fontWeight: 400,
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
  fontNormal?: boolean;
  fontSize?: string;
  fullWidth?: boolean;
  activeWithSearch?: boolean;
  bg0?: string;
  bg1?: string;
}

export function TabPanel({
  tabs,
  onChange,
  active,
  fullWidth,
  fontNormal,
  activeWithSearch,
  fontSize = "14px",
  bg0,
  bg1,
}: TabPanelProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
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

      if (activeWithSearch) {
        return location.search.includes(tab.key);
      }

      return location.pathname.includes(tab.key);
    }
    if (active) return active === tab.key;
    if (!activeButtonKey) return tabs[0].key === tab.key;
    return activeButtonKey === tab.key;
  };

  return (
    <Grid container justifyContent="center">
      <Box
        sx={{
          display: "grid",
          width: fullWidth ? "100%" : "auto",
          backgroundColor: bg0 ?? theme.colors.darkLevel1,
          borderRadius: "15px",
          padding: "4px",
          gridTemplateColumns: fullWidth ? `repeat(${tabs.length}, 1fr)` : `repeat(${tabs.length}, auto)`,
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            className={`${classes.switchButton}${fontNormal ? " fontNormal" : ""}${isActive(tab) ? " active" : ""}`}
            onClick={() => loadPage(tab)}
            sx={{
              fontSize,
              "&.active": {
                background: bg1 ?? theme.colors.darkLevel3,
              },
            }}
          >
            <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
              {tab.value}
            </Grid>
          </Box>
        ))}
      </Box>
    </Grid>
  );
}
