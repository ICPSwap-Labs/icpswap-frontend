import { Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { Box } from "components/Mui";

import { CurrencyAvatar } from "./CurrencyAvatar";

export interface CurrenciesAvatarProps {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  borderColor: string;
  bgColor: string;
  className?: any;
  size?: string;
}

export function CurrenciesAvatar({
  currencyA,
  currencyB,
  borderColor = "#ffffff",
  bgColor = "#97a4ef",
  size,
}: CurrenciesAvatarProps) {
  return (
    <Flex sx={{ "& .currencyB": { position: "relative", left: "-8px" } }}>
      <CurrencyAvatar borderColor={borderColor} bgColor={bgColor} currency={currencyA} size={size} />
      <Box className="currencyB">
        <CurrencyAvatar borderColor={borderColor} bgColor={bgColor} currency={currencyB} size={size} />
      </Box>
    </Flex>
  );
}
