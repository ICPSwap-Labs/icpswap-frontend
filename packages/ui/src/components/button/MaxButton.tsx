import { TypographyProps } from "../Mui";
import { SmallButton } from "./SmallButton";

export interface MaxButtonProps {
  onClick: TypographyProps["onClick"];
  background?: string;
  color?: string;
}

export function MaxButton({ onClick, background, color }: MaxButtonProps) {
  return (
    <SmallButton onClick={onClick} background={background} color={color} fontWeight={600}>
      MAX
    </SmallButton>
  );
}
