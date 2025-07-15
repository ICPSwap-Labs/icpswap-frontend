import { Typography } from "components/Mui";
import { useParsedQueryString } from "@icpswap/hooks";
import { Flex } from "@icpswap/ui";
import { useCallback, useEffect, useState } from "react";

type Panel = { value: string; label: string };

interface TitleTextPanelsProps {
  panels: Panel[];
  activePanel?: string;
  onPanelClick?: (panel: string) => void;
}

export function TitleTextPanels({ panels, activePanel: __activePanel, onPanelClick }: TitleTextPanelsProps) {
  const [activePanel, setActivePanel] = useState<string | undefined>(undefined);

  const { panel } = useParsedQueryString() as {
    panel: string | undefined;
  };

  useEffect(() => {
    if (panel) {
      setActivePanel(panel);
    } else if (__activePanel) {
      setActivePanel(__activePanel);
    } else {
      setActivePanel(panels[0].value);
    }
  }, [panel, __activePanel, panels]);

  const handlePanelClick = useCallback(
    (panel: Panel) => {
      if (onPanelClick) onPanelClick(panel.value);
      setActivePanel(panel.value);
    },
    [setActivePanel, onPanelClick],
  );

  return (
    <Flex gap="0 24px">
      {panels.map((panel) => (
        <Typography
          key={panel.value}
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: activePanel === panel.value ? "text.primary" : "text.secondary",
            cursor: "pointer",
          }}
          onClick={() => handlePanelClick(panel)}
        >
          {panel.label}
        </Typography>
      ))}
    </Flex>
  );
}
