import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { Typography, useTheme } from "components/Mui";
import { Flex, MainCard } from "@icpswap/ui";
import { ArrowUpRight } from "react-feather";
import { useTranslation } from "react-i18next";

export interface ToReclaimProps {
  fontSize?: "12px" | "14px";
}

export function ToReclaim({ fontSize = "14px" }: ToReclaimProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  const handleViewAll = useCallback(() => {
    history.push("/swap/withdraw");
  }, [history]);

  return (
    <MainCard padding="16px 24px" level={1}>
      <Flex fullWidth gap="0 4px" sx={{ cursor: "pointer" }} onClick={handleViewAll}>
        <Typography sx={{ flex: 1, fontSize: fontSize ?? "14px" }}>
          {t("swap.missing.tokens")}
          <ArrowUpRight color={theme.colors.secondaryMain} size="16px" style={{ position: "relative", top: "4px" }} />
        </Typography>
      </Flex>
    </MainCard>
  );
}
