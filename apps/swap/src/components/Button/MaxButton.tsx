import { TypographyProps } from "components/Mui";

import { useTranslation } from "react-i18next";
import { SmallButton } from "./SmallButton";

export interface MaxButtonProps {
  onClick: TypographyProps["onClick"];
  background?: string;
}

export function MaxButton({ onClick, background }: MaxButtonProps) {
  const { t } = useTranslation();

  return (
    <SmallButton onClick={onClick} background={background}>
      {t("common.max")}
    </SmallButton>
  );
}
