import { Trans } from "@lingui/macro";
import { Box, Typography } from "components/Mui";
import { locationSearchReplace } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { useHistory, useLocation } from "react-router-dom";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools/index";
import { Null } from "@icpswap/types";
import { PositionTable } from "components/liquidity/index";

export default function Positions() {
  const history = useHistory();
  const location = useLocation();
  const { pair, principal } = useParsedQueryString() as { pair: string | undefined; principal: string | undefined };

  const handlePairChange = (pairId: string | undefined) => {
    const search = locationSearchReplace(location.search, "pair", pairId);
    history.push(`/info-tools/positions${search}`);
  };

  const handleAddressChange = (principal: string | Null) => {
    const search = locationSearchReplace(location.search, "principal", principal);
    history.push(`/info-tools/positions${search}`);
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: <Trans>Tools</Trans>, link: "/info-tools" }, { label: <Trans>Positions</Trans> }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={<Trans>Positions</Trans>}
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
              <Typography>
                <Trans>Select a Pair:</Trans>
              </Typography>

              <SelectPair
                value={pair}
                onPairChange={handlePairChange}
                search
                showClean={false}
                showBackground={false}
                panelPadding="0px"
                defaultPanel={
                  <Typography color="text.primary">
                    <Trans>Please select</Trans>
                  </Typography>
                }
              />
            </Flex>

            {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
          </Box>
        }
      >
        <PositionTable poolId={pair} principal={principal} />
      </ToolsWrapper>
    </InfoWrapper>
  );
}
