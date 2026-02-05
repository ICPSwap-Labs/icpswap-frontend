import { useState, ReactNode, useCallback, useRef, useEffect } from "react";
import { Box, useTheme, Typography } from "components/Mui";
import { Null } from "@icpswap/types";
import { useSetTimeoutCall } from "@icpswap/hooks";

interface Tab {
  value: string;
  label: ReactNode;
}

interface TabItemProps {
  tab: Tab;
  active: boolean;
  onClick?: (tab: Tab) => void;
}

function TabItem({ tab, active, onClick }: TabItemProps) {
  const handleTabClick = useCallback(() => {
    if (onClick) {
      onClick(tab);
    }
  }, [onClick, tab]);

  return (
    <Box className={active ? "active" : ""} onClick={handleTabClick}>
      <Typography
        className={active ? "active" : ""}
        sx={{
          whiteSpace: "nowrap",
          cursor: "pointer",
          borderRadius: "40px",
          padding: "8px 16px",
          "&.active": {
            color: "text.primary",
            fontWeight: 500,
          },
        }}
      >
        {tab.label}
      </Typography>
    </Box>
  );
}

function ActiveTabBackground({ width, offsetLeft }: { width: string | Null; offsetLeft: number | Null }) {
  const theme = useTheme();
  const [activeTabChange, setActiveTabChange] = useState(false);

  const clearChangeFlag = useSetTimeoutCall(
    useCallback(() => {
      setActiveTabChange(false);
    }, []),
    300,
  );

  useEffect(() => {
    if (offsetLeft !== null) {
      setActiveTabChange(true);
      clearChangeFlag();
    }
  }, [offsetLeft, clearChangeFlag]);

  return (
    <Box
      sx={{
        display: !width ? "none" : "block",
        position: "absolute",
        borderRadius: "40px",
        border: `1px solid ${theme.palette.border["3"]}`,
        width: width ?? "0px",
        height: "32px",
        zIndex: 10,
        opacity: activeTabChange ? 0.7 : 1,
        transform: `translateX(${offsetLeft}px) translateY(-1px)`,
        transition: "all 0.3s ease",
      }}
    />
  );
}

export interface OutlineCircleTabListProps {
  active?: string;
  tabs: Tab[];
  onChange?: (tab: Tab) => void;
}

export function OutlineCircleTabList({ tabs, onChange }: OutlineCircleTabListProps) {
  const tabListRef = useRef(null);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);
  const [backgroundWidth, setBackgroundWidth] = useState<string | Null>(null);
  const [activeTabLeft, setActiveTabLeft] = useState<number>(0);

  const handleTabClick = useCallback(
    (tab: Tab) => {
      setActiveTab(tab.value);
      if (onChange) onChange(tab);
    },
    [setActiveTab, onChange],
  );

  useEffect(() => {
    // Reset active tab to first tab when tabs change
    setActiveTab(tabs[0].value);
  }, [tabs]);

  useEffect(() => {
    setBackgroundWidth(null);
    setActiveTabLeft(0);

    if (tabListRef.current) {
      const dom = tabListRef.current as HTMLElement;
      const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);

      const activeTabElement = Array.from(dom.children).find((child, index) => index === activeIndex) as
        | HTMLElement
        | undefined;

      if (activeTabElement) {
        const activeTabWidth = activeTabElement.offsetWidth;
        setBackgroundWidth(`${activeTabWidth}px`);
        setActiveTabLeft(activeTabElement.offsetLeft);
      }
    }
  }, [tabs, tabListRef, activeTab, tabListRef.current]);

  return (
    <Box ref={tabListRef} sx={{ position: "relative", display: "flex", gap: "0 4px" }}>
      {tabs.map((tab) => (
        <TabItem key={tab.value} tab={tab} active={activeTab === tab.value} onClick={handleTabClick} />
      ))}

      <ActiveTabBackground width={backgroundWidth} offsetLeft={activeTabLeft} />
    </Box>
  );
}
