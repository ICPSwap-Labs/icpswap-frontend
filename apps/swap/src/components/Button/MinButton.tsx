import { TypographyProps } from "@mui/material";
import { Trans } from "@lingui/macro";
import { SmallButton } from "./SmallButton";

export interface MinButtonProps {
  onClick: TypographyProps["onClick"];
}

export function MinButton({ onClick }: MinButtonProps) {
  return (
    <SmallButton onClick={onClick}>
      <Trans>Min</Trans>
    </SmallButton>
  );
}
