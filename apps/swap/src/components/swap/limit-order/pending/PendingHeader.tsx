import { Flex, HeaderCell } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface PendingHeaderProps {
  wrapperClasses?: string;
}

export function PendingHeader({ wrapperClasses }: PendingHeaderProps) {
  const { t } = useTranslation();

  return (
    <Flex className={wrapperClasses} sx={{ padding: "16px" }}>
      <HeaderCell>{t("common.time")}</HeaderCell>
      <HeaderCell>{t("common.you.pay")}</HeaderCell>
      <HeaderCell>{t("common.you.receive")}</HeaderCell>
      <HeaderCell align="right">{t("common.limit.price")}</HeaderCell>
      <HeaderCell align="right">{t("common.filled")}</HeaderCell>
      <HeaderCell align="right">&nbsp;</HeaderCell>
    </Flex>
  );
}
