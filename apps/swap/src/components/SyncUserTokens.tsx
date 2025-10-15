import { Typography, CircularProgress } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { useSyncYourTokensHandler } from "hooks/wallet/useSyncYourTokens";

export function SyncUserTokens() {
  const { t } = useTranslation();
  const { loading, syncYourTokensHandler } = useSyncYourTokensHandler();

  return (
    <Flex gap="0 4px" onClick={syncYourTokensHandler} sx={{ cursor: "pointer" }}>
      <Typography align="center">{loading ? t("wallet.token.sync.loading") : t("wallet.token.sync")}</Typography>
      <Flex
        sx={{
          color: "#ffffff",
          width: "24px",
          height: "24px",
          overflow: "hidden",
        }}
      >
        {loading ? <CircularProgress color="inherit" size={14} /> : <img src="/images/sync.svg" alt="" />}
      </Flex>
    </Flex>
  );
}
