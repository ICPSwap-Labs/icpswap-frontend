import { useTheme, Typography, Box, makeStyles, Theme, CircularProgress } from "components/Mui";
import { useCallback, useState } from "react";
import { getTokenStandard } from "hooks/token/index";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { registerTokens } from "@icpswap/token-adapter";
import { useTranslation } from "react-i18next";
import { syncServerTokenInfo } from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";

const useStyles = makeStyles((theme: Theme) => {
  return {
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "140px",
      height: "40px",
      borderRadius: "8px",
      background: theme.palette.background.level1,
      cursor: "pointer",
    },
  };
});

export interface ImportTokenTipProps {
  onOk: () => void;
  onNo: () => void;
  canisterId: string;
}

export function ImportTokenTip({ canisterId, onOk }: ImportTokenTipProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const updateTokenStandard = useUpdateTokenStandard();

  const [noStandard, setNoStandard] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImport = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const standard = await getTokenStandard({ canisterId });

    if (standard === TOKEN_STANDARD.ICRC1 || standard === TOKEN_STANDARD.ICRC2) {
      await syncServerTokenInfo(canisterId);
    }

    if (isUndefinedOrNull(standard)) {
      setNoStandard(true);
    } else {
      updateTokenStandard([{ canisterId, standard }]);
      registerTokens([{ canisterId, standard }]);
      onOk();
    }
    setLoading(false);
  }, [canisterId, updateTokenStandard, loading]);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "24px",
      }}
    >
      <Typography align="center">{t("token.not.found")}</Typography>

      {noStandard ? (
        <Typography
          sx={{ fontSize: "16px", fontWeight: 500, color: "text.danger", margin: "12px 0", textAlign: "center" }}
        >
          {t("token.no.standard")}
        </Typography>
      ) : null}

      <Box mt="16px" sx={{ display: "flex", justifyContent: "center", gap: "0 20px" }}>
        <Box className={classes.button} onClick={handleImport}>
          <Typography color="text.primary" fontWeight={500}>
            {t("common.yes")}
          </Typography>
          {loading ? <CircularProgress color="inherit" size={16} sx={{ margin: "0 0 0 6px" }} /> : null}
        </Box>
      </Box>
    </Box>
  );
}
