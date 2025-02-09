import { Typography, Box } from "components/Mui";
import { InfoWrapper } from "components/index";
import { MainCard } from "@icpswap/ui";
import { useNodeInfoAllTokens } from "@icpswap/hooks";
import { TokenTable } from "components/info";
import { useTranslation } from "react-i18next";

export default function Tokens() {
  const { t } = useTranslation();
  const { result: tokens, loading } = useNodeInfoAllTokens();

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
