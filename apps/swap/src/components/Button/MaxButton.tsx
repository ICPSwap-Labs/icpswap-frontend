import { TypographyProps } from "@mui/material";
import { Trans } from "@lingui/macro";
import { SmallButton } from "./SmallButton";

export interface MaxButtonProps {
  onClick: TypographyProps["onClick"];
  background?: string;
}

export function MaxButton({ onClick, background }: MaxButtonProps) {
  return (
    <SmallButton onClick={onClick} background={background}>
      <Trans>MAX</Trans>
    </SmallButton>
  );
}
