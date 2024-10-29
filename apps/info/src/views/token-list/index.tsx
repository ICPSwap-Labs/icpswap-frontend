import { Box, Typography } from "ui-component/Mui";
import { MainCard } from "@icpswap/ui";
import TokenList from "ui-component/token-list/TokenList";
import MainContainer from "ui-component/MainContainer";
import { Trans } from "@lingui/macro";

export default function _TokeList() {
  return (
    <MainContainer>
      <MainCard>
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h3" component="div">
            <Trans>Token List</Trans>
          </Typography>
        </Box>

        <Box sx={{ margin: "8px 0 32px 0" }}>
          <Typography sx={{ fontSize: "14px" }}>
            <Trans>
              Disclaimer: Do your own research before investing. While we've collected known information about tokens on
              the list, it's essential to conduct your research.
            </Trans>
          </Typography>
        </Box>

        <TokenList />
      </MainCard>
    </MainContainer>
  );
}
