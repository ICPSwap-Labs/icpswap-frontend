import { Box, Typography, useTheme } from "components/Mui";
import { locationSearchReplace } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { ToolsWrapper, SneedLockedPositions, BlackHolePositions } from "components/info/tools/index";
import { useEffect, useState } from "react";
import i18n from "i18n/index";
import { useTranslation } from "react-i18next";

enum Panel {
  BlackHole = "BlackHole",
  Sneed = "Sneed",
}

const panels = [
  { value: Panel.BlackHole, label: i18n.t("common.black.hole") },
  { value: Panel.Sneed, label: i18n.t("common.sneed.locked") },
];

export default function LockedPositions() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const { pair, panel } = useParsedQueryString() as {
    panel: string | undefined;
    pair: string | undefined;
  };

  const [activePanel, setActivePanel] = useState<Panel>(Panel.BlackHole);

  useEffect(() => {
    if (panel) {
      setActivePanel(panel as Panel);
    }
  }, [panel]);

  const handlePairChange = (pairId: string | undefined) => {
    const search = locationSearchReplace(location.search, "pair", pairId);
    history.push(`/info-tools/locked-positions${search}`);
  };

  const handlePanelClick = (panel: Panel) => {
    const search = locationSearchReplace(location.search, "panel", panel);
    history.push(`/info-tools/locked-positions${search}`);
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[
          { label: t("common.tools"), link: "/info-tools" },
          { label: activePanel === Panel.BlackHole ? t("common.black.hole") : t("common.sneed.locked") },
        ]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper>
        <Flex
          gap="0 24px"
          sx={{
            padding: "24px",
            borderBottom: `1px solid ${theme.palette.background.level1}`,
            "@media(max-width:640px)": { padding: "16px" },
          }}
        >
          {panels.map((panel) => (
            <Typography
              key={panel.value}
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: activePanel === panel.value ? "text.primary" : "text.secondary",
                cursor: "pointer",
              }}
              onClick={() => handlePanelClick(panel.value)}
            >
              {panel.label}
            </Typography>
          ))}
        </Flex>

        <Box
          sx={{
            padding: "20px 24px",
            borderBottom: `1px solid ${theme.palette.background.level1}`,
            "@media(max-width:640px)": { padding: "16px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <Flex sx={{ width: "fit-content", minWidth: "214px" }} gap="0 4px">
              <Typography>{t("common.select.pair.colon")}</Typography>

              <SelectPair
                value={pair}
                onPairChange={handlePairChange}
                search
                showClean={false}
                showBackground={false}
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.please.select")}</Typography>}
              />
            </Flex>

            {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
          </Box>
        </Box>

        {activePanel === Panel.BlackHole ? <BlackHolePositions poolId={pair} /> : null}
        {activePanel === Panel.Sneed ? <SneedLockedPositions poolId={pair} /> : null}
      </ToolsWrapper>
    </InfoWrapper>
  );
}
