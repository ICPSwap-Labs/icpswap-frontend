import { useNodeInfoAllTokens } from "@icpswap/hooks";
import { MainCard } from "@icpswap/ui";
import { InfoWrapper } from "components/index";
import { TokenTable } from "components/info";
import { Box, Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function Tokens() {
  const { t } = useTranslation();
  const { data: tokens, isLoading: loading } = useNodeInfoAllTokens();

  return (
    <InfoWrapper>
      <Box>
        <Typography color="text.primary" fontSize="20px" fontWeight="500">
          {t("info.all.tokens")}
        </Typography>
      </Box>

      <Box mt="20px">
        <MainCard>
          <Box
            sx={{
              width: "100%",
              overflow: "auto hidden",
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
