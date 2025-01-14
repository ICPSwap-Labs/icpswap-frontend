import { Box, Typography } from "components/Mui";
import { MainCard } from "@icpswap/ui";
import { Tokens } from "components/info/tokens/index";
import { Trans } from "@lingui/macro";
import { InfoWrapper } from "components/index";

export default function __Tokens() {
  return (
    <InfoWrapper>
      <Box sx={{ margin: "8px 0 32px 0" }}>
        <Typography sx={{ fontSize: "14px" }}>
          <Trans>
            Disclaimer: Do your own research before investing. While we've collected known information about tokens on
            the list, it's essential to conduct your research.
          </Trans>
        </Typography>
      </Box>

      <MainCard>
        <Tokens />
      </MainCard>
    </InfoWrapper>
  );
}
