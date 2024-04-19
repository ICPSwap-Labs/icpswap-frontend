import { TypographyProps } from "@mui/material";
import { Trans } from "@lingui/macro";
import { SmallButton } from "./SmallButton";

export interface MaxButtonProps {
  onClick: TypographyProps["onClick"];
}

export function MaxButton({ onClick }: MaxButtonProps) {
  return (
    <SmallButton onClick={onClick}>
      <Trans>Max</Trans>
    </SmallButton>
  );
}
