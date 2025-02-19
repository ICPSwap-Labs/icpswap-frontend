import { useTranslation } from "react-i18next";

import { TypographyProps } from "../Mui";
import { SmallButton } from "./SmallButton";

export interface MinButtonProps {
  onClick: TypographyProps["onClick"];
  background?: string;
  color?: string;
}

export function MinButton({ onClick, background, color }: MinButtonProps) {
  const { t } = useTranslation();

  return (
    <SmallButton onClick={onClick} background={background} color={color} fontWeight={600}>
      {t("common.min")}
    </SmallButton>
  );
}
