import { Flex, Link, MainCard } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export interface ToReclaimProps {
  fontSize?: "12px" | "14px";
}

export function ToReclaim({ fontSize = "14px" }: ToReclaimProps) {
  const { t } = useTranslation();

  return (
    <MainCard padding="16px 24px" level={1}>
      <Flex fullWidth>
        <Flex>
          <Typography sx={{ fontSize: fontSize ?? "14px" }}>{t("swap.missing.tokens")}&nbsp;</Typography>
          <Link to="/swap/withdraw" color="secondary">
            {t("common.check.here")}
          </Link>
        </Flex>
      </Flex>
    </MainCard>
  );
}
