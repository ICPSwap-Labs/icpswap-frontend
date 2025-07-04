import { Flex, Link, MainCard } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export interface ToReclaimProps {
  fontSize?: "12px" | "14px";
  poolId: string;
  ui?: "pro";
  background?: number;
  borderRadius?: "12px" | "16px";
}

export function ToReclaim({ poolId, fontSize = "14px", ui, borderRadius = "16px", background = 1 }: ToReclaimProps) {
  const { t } = useTranslation();

  return (
    <MainCard
      padding={ui === "pro" ? "10px" : "16px 24px"}
      borderRadius={ui === "pro" ? "12px" : borderRadius}
      level={background}
    >
      <Flex fullWidth>
        <Flex sx={{ fontSize: fontSize ?? "14px" }}>
          <Typography sx={{ fontSize: fontSize ?? "14px" }}>{t("swap.missing.tokens")}&nbsp;</Typography>
          <Link to={`/swap/withdraw?type=pair&poolId=${poolId}`} color="secondary">
            {t("common.check.here")}
          </Link>
        </Flex>
      </Flex>
    </MainCard>
  );
}
