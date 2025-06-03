import { Flex, HeaderCell } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface HistoryHeaderProps {
  wrapperClasses?: string;
}

export function HistoryHeader({ wrapperClasses }: HistoryHeaderProps) {
  const { t } = useTranslation();

  return (
    <Flex className={wrapperClasses} sx={{ padding: "16px" }}>
      <HeaderCell>{t("common.time")}</HeaderCell>
      <HeaderCell>{t("common.you.paid")}</HeaderCell>
      <HeaderCell>{t("common.you.received")}</HeaderCell>
      <HeaderCell align="right">{t("common.limit.price")}</HeaderCell>
      {/* <HeaderCell align="right">&nbsp;</HeaderCell> */}
    </Flex>
  );
}
