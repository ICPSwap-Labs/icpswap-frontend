import { useState, ReactNode, useCallback, useRef, useEffect, memo } from "react";
import { Box, useTheme, Typography } from "components/Mui";
import { Null } from "@icpswap/types";
import { useSetTimeoutCall } from "@icpswap/hooks";

export interface UnderLineTab {
  value: string;
  label: ReactNode;
}

interface TabItemProps {
  tab: UnderLineTab;
  active: boolean;
  onClick?: (tab: UnderLineTab) => void;
}

function TabItem({ tab, active, onClick }: TabItemProps) {
  const handleTabClick = useCallback(() => {
    if (onClick) {
      onClick(tab);
    }
  }, [onClick, tab]);

  return (
    <Typography
      sx={{
        position: "relative",
        color: active ? "text.primary" : "text.secondary",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: "18px",
        "@media(max-width: 640px)": {
          fontSize: "16px",
          lineHeight: "16px",
        },
      }}
      onClick={handleTabClick}
    >
      {tab.label}
    </Typography>
  );
}

function ActiveTabBackground({ width, offsetLeft }: { width: number | Null; offsetLeft: number | Null }) {
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
        position: "absolute",
        left: 0,
        bottom: 0,
        opacity: activeTabChange ? 0.7 : 1,
        transform: `translate3d(${offsetLeft}px, 10px, 0px) scale3d(${width}, 1, 1)`,
        transition: "all 0.3s ease",
        width: "1px",
        height: "2px",
        background: theme.colors.secondaryMain,
        transformOrigin: "left center",
      }}
    />
  );
}

export interface UnderLineTabListProps {
  tabs: UnderLineTab[];
  onChange?: (tab: UnderLineTab) => void;
  activeTabValue?: string;
}

function __UnderLineTabList({ tabs, onChange, activeTabValue }: UnderLineTabListProps) {
  const tabListRef = useRef(null);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);
  const [backgroundWidth, setBackgroundWidth] = useState<number | Null>(null);
  const [activeTabLeft, setActiveTabLeft] = useState<number>(0);

  const handleTabClick = useCallback(
    (tab: UnderLineTab) => {
      setActiveTab(tab.value);
      if (onChange) onChange(tab);
    },
    [setActiveTab, onChange],
  );

  useEffect(() => {
    if (activeTabValue) {
      setActiveTab(activeTabValue);
    } else {
      // Reset active tab to first tab when tabs change
      setActiveTab(tabs[0].value);
    }
  }, [tabs, activeTabValue]);

  useEffect(() => {
    if (tabListRef.current) {
      const dom = tabListRef.current as HTMLElement;
      const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);

      const activeTabElement = Array.from(dom.children).find((child, index) => index === activeIndex) as
        | HTMLElement
        | undefined;

      if (activeTabElement) {
        const activeTabWidth = activeTabElement.offsetWidth;
        setBackgroundWidth(activeTabWidth);
        setActiveTabLeft(activeTabElement.offsetLeft);
      }
    }
  }, [tabs, tabListRef, activeTab, tabListRef.current]);

  return (
    <Box ref={tabListRef} sx={{ position: "relative", display: "flex", gap: "0 20px" }}>
      {tabs.map((tab) => (
        <TabItem key={tab.value} tab={tab} active={activeTab === tab.value} onClick={handleTabClick} />
      ))}

      <ActiveTabBackground width={backgroundWidth} offsetLeft={activeTabLeft} />
    </Box>
  );
}

export const UnderLineTabList = memo(__UnderLineTabList);
