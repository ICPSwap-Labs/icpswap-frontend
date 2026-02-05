import { Box, Typography, useTheme } from "components/Mui";
import {
  isUndefinedOrNull,
  locationSearchReplace,
  locationMultipleSearchReplace,
  nonUndefinedOrNull,
} from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { useNavigate, useLocation } from "react-router-dom";
import { ToolsWrapper } from "components/info/tools/index";
import { PositionTransactionsTable } from "components/info/index";
import { infoRoutesConfigs } from "routes/info.config";
import { useTranslation } from "react-i18next";
import { TitleTextPanels } from "components/UI/panel";
import i18n from "i18n";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

enum Panel {
  AllPosition = "AllPosition",
  MyPosition = "MyPosition",
}

const __panels = [
  { value: Panel.AllPosition, label: i18n.t("common.position.transfer") },
  { value: Panel.MyPosition, label: i18n.t("common.tools.my.position.transfer") },
];

export default function PositionTransactions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const accountPrincipal = useAccountPrincipalString();

  const { pair, principal, panel } = useParsedQueryString() as {
    pair: string | undefined;
    principal: string | undefined;
    panel: string | undefined;
  };

  const panels = useMemo(() => {
    if (isUndefinedOrNull(accountPrincipal)) return [__panels[0]];
    return __panels;
  }, [__panels, accountPrincipal]);

  const activePanel = useMemo(() => {
    return panel ?? (isUndefinedOrNull(principal) ? panels[0].value : Panel.MyPosition);
  }, [panel, principal]);

  const handlePairChange = (pairId: string | undefined) => {
    const search = locationSearchReplace(location.search, "pair", pairId);
    navigate(`${infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS}${search}`);
  };

  const handlePanelClick = (panel: string) => {
    if (panel === Panel.AllPosition) {
      const search = locationMultipleSearchReplace(location.search, [
        { key: "panel", value: panel },
        { key: "principal", value: undefined },
      ]);
      navigate(`${infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS}${search}`);
    } else {
      const search = locationSearchReplace(location.search, "panel", panel);
      navigate(`${infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS}${search}`);
    }
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("common.position.transfer") }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper>
        <Flex
          sx={{
            padding: "24px",
            borderBottom: `1px solid ${theme.palette.background.level1}`,
            "@media(max-width:640px)": { padding: "16px" },
          }}
        >
          <TitleTextPanels panels={panels} onPanelClick={handlePanelClick} activePanel={activePanel} />
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
                showBackground={false}
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.select.all.pair")}</Typography>}
              />
            </Flex>

            {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
          </Box>
        </Box>

        {activePanel === Panel.AllPosition ? (
          <PositionTransactionsTable poolId={pair} empty={t("info.tools.position.transactions.empty")} />
        ) : null}
        {activePanel === Panel.MyPosition && nonUndefinedOrNull(principal ?? accountPrincipal) ? (
          <PositionTransactionsTable
            poolId={pair}
            principal={principal ?? accountPrincipal}
            empty={t("info.tools.position.transactions.empty")}
          />
        ) : null}
      </ToolsWrapper>
    </InfoWrapper>
  );
}
