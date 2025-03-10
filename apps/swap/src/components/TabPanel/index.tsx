import { useState, ReactNode } from "react";
import { Grid, Box, useTheme } from "components/Mui";
import { useHistory, useLocation } from "react-router-dom";
import { mockALinkAndOpen } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";

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
  size?: "small" | "large" | "medium";
  borderRadius?: string;
  padding0?: string;
  padding1?: string;
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
  size,
  borderRadius,
  padding0,
  padding1,
}: TabPanelProps) {
  const theme = useTheme();
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
          borderRadius: borderRadius ?? (size === "small" ? "8px" : "15px"),
          padding: padding0 ?? "4px",
          gridTemplateColumns: fullWidth ? `repeat(${tabs.length}, 1fr)` : `repeat(${tabs.length}, auto)`,
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            className={`${fontNormal ? " fontNormal" : ""} ${isActive(tab) ? "active" : ""}`}
            onClick={() => loadPage(tab)}
            sx={{
              fontSize,
              minWidth: size === "small" ? "auto" : "90px",
              padding: padding1 ?? (size === "small" ? "0 12px" : "0 20px"),
              height: size === "small" ? "32px" : "40px",
              color: theme.themeOption.textSecondary,
              cursor: "pointer",
              borderRadius: borderRadius ?? (size === "small" ? "6px" : "12px"),
              fontWeight: fontNormal ? 400 : 600,
              "&.active": {
                color: theme.themeOption.textPrimary,
                background: bg1 ?? theme.colors.darkLevel3,
                fontWeight: 600,
              },
              "@media (max-width: 640px)": {
                minWidth: size === "small" ? "auto" : "76px",
                padding: size === "small" ? "0 12px" : "0 15px",
                fontSize: "12px",
              },
            }}
          >
            <Flex justify="center" sx={{ height: "100%", userSelect: "none" }}>
              {tab.value}
            </Flex>
          </Box>
        ))}
      </Box>
    </Grid>
  );
}
