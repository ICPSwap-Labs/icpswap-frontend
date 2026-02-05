import { useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { locationSearchReplace } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { useNavigate, useLocation } from "react-router-dom";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools/index";
import { Null } from "@icpswap/types";
import { PositionTable } from "components/liquidity/index";
import { useTranslation } from "react-i18next";

export default function Positions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pair: pairFromUrl, principal } = useParsedQueryString() as {
    pair: string | undefined;
    principal: string | undefined;
  };

  const handlePairChange = (pairId: string | undefined) => {
    const search = locationSearchReplace(location.search, "pair", pairId);
    navigate(`/info-tools/positions${search}`);
  };

  const handleAddressChange = (principal: string | Null) => {
    const search = locationSearchReplace(location.search, "principal", principal);
    navigate(`/info-tools/positions${search}`);
  };

  // Default ICS/ICP
  const pair = useMemo(() => pairFromUrl ?? "uizni-yiaaa-aaaag-qjrca-cai", [pairFromUrl]);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1 links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("common.positions") }]} />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={t("common.positions")}
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
            <PrincipalSearcher
              placeholder="Search the principal for positions"
              onPrincipalChange={handleAddressChange}
            />

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
        }
      >
        <PositionTable
          poolId={pair}
          principal={principal}
          empty={t("info.tools.positions.empty")}
          paginationPadding={{ sm: "16px 0", lg: "24px 0" }}
        />
      </ToolsWrapper>
    </InfoWrapper>
  );
}
