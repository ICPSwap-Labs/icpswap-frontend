import { Box, Typography } from "components/Mui";
import { locationSearchReplace } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { ToolsWrapper } from "components/info/tools/index";
import { PositionTransactionsTable } from "components/info/index";
import { infoRoutesConfigs } from "routes/info.config";
import { useTranslation } from "react-i18next";

export default function PositionTransactions() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { pair, principal } = useParsedQueryString() as { pair: string | undefined; principal: string | undefined };

  const handlePairChange = (pairId: string | undefined) => {
    const search = locationSearchReplace(location.search, "pair", pairId);
    history.push(`${infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS}${search}`);
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("common.position.transfer") }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={t("common.position.transfer")}
        action={
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
        }
      >
        <PositionTransactionsTable poolId={pair} principal={principal} />
      </ToolsWrapper>
    </InfoWrapper>
  );
}
