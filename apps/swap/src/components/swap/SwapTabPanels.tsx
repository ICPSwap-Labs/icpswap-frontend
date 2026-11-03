import i18n from "i18n/index";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./swap-design.css";

export enum TABS {
  SWAP = "Swap",
  LIMIT = "Limit",
}

const Tabs = [
  { value: TABS.SWAP, label: i18n.t("common.swap"), path: "/swap" },
  { value: TABS.LIMIT, label: i18n.t("common.limit"), path: "/swap/limit" },
];

export interface SwapTabPanelsProps {
  currentTab: TABS;
}

export function SwapTabPanels({ currentTab }: SwapTabPanelsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = useCallback(
    (path: string) => {
      navigate(`${path}${location.search}`);
    },
    [navigate, location],
  );

  return (
    <div className="tabs swap-mode-tabs" role="tablist">
      {Tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === tab.value}
          key={tab.value}
          className={`tab ${currentTab === tab.value ? "tab-active" : ""}`}
          onClick={() => handleTabChange(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
