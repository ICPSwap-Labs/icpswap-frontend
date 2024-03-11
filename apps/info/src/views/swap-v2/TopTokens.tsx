import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard } from "ui-component/index";
import { useGraphAllTokens } from "hooks/v2";
import TokenTable from "ui-component/analytic-v2/TokenTable";

export default function TopTokens() {
  const { result: allTokens, loading } = useGraphAllTokens();

  return (
    <MainCard>
      <Typography variant="h4">
        <Trans>Top Tokens</Trans>
      </Typography>

      <Box mt="20px" sx={{ overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <TokenTable tokens={allTokens} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
