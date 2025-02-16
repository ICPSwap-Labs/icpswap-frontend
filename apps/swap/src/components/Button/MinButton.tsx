import { TypographyProps } from "components/Mui";
import { useTranslation } from "react-i18next";

import { SmallButton } from "./SmallButton";

export interface MinButtonProps {
  onClick: TypographyProps["onClick"];
}

export function MinButton({ onClick }: MinButtonProps) {
  const { t } = useTranslation();

  return <SmallButton onClick={onClick}>{t("common.min")}</SmallButton>;
}
