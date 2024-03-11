import { Typography, Box } from "@mui/material";
import Wrapper from "ui-component/Wrapper";
import { Trans } from "@lingui/macro";
import { MainCard } from "ui-component/index";
import { useGraphAllTokens } from "hooks/v2";
import TokenTable from "ui-component/analytic-v2/TokenTable";

export default function Tokens() {
  const { result: tokens, loading } = useGraphAllTokens();

  return (
    <Wrapper>
      <Box>
        <Typography color="text.primary" fontSize="20px" fontWeight="500">
          <Trans>All Tokens</Trans>
        </Typography>
      </Box>

      <Box mt="20px">
        <MainCard>
          <Box
            sx={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: "1200px",
              }}
            >
              <TokenTable tokens={tokens} loading={loading} />
            </Box>
          </Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
