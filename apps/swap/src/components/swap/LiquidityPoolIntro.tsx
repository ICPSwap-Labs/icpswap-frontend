import { Box, Typography } from "components/Mui";
import { MainCard } from "components/index";
import { useTranslation } from "react-i18next";

export default function LiquidityPoolIntro() {
  const { t } = useTranslation();

  return (
    <MainCard level={1} sx={{ height: "244px" }} className="lightGray200">
      <Typography variant="h3" align="center" color="text.primary">
        {t("liquidity.pool")}
      </Typography>
      <Box mt={2}>
        <Typography fontSize={16} align="center">
          {t("liquidity.descriptions")}
        </Typography>
      </Box>
    </MainCard>
  );
}
