import { Typography, Box } from "components/Mui";
import { InfoWrapper } from "components/index";
import { MainCard } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { useNodeInfoAllTokens } from "@icpswap/hooks";
import { TokenTable } from "components/info";

export default function Tokens() {
  const { result: tokens, loading } = useNodeInfoAllTokens();

  return (
    <InfoWrapper>
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
    </InfoWrapper>
  );
}
