import { Box, Typography, useTheme } from "components/Mui";
import { useTokenIsInTokenList } from "store/global/hooks";
import { ReactComponent as TokenListDarkIcon } from "assets/icons/token-list-dark.svg";
import { useTranslation } from "react-i18next";

export interface TokenListIdentifyingProps {
  tokenId: string | undefined;
}

export function TokenListIdentifying({ tokenId }: TokenListIdentifyingProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const inTokenList = useTokenIsInTokenList(tokenId);

  return inTokenList ? (
    <Box
      sx={{
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "0 10px",
        borderRadius: "60px",
        background: theme.colors.successDark,
        gap: "0 2px",
      }}
    >
      <TokenListDarkIcon />
      <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#1A223F" }}>{t("common.token.list")}</Typography>
    </Box>
  ) : null;
}
