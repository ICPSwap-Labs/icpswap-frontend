import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";

export interface CurrencyAvatarProps {
  currency: Token | undefined | null;
  borderColor?: string;
  bgColor?: string;
  className?: string;
  size?: string;
}

export function CurrencyAvatar({ currency, borderColor = "#ffffff", size }: CurrencyAvatarProps) {
  return (
    <TokenImage
      size={size ?? "24px"}
      sx={{ border: borderColor ? `1px solid ${borderColor}` : "none", overflow: "hidden", borderRadius: "50%" }}
      logo={currency?.logo}
      tokenId={currency?.address}
    />
  );
}
