import { Typography } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { Flex, Tooltip } from "@icpswap/ui";
import { formatAmount } from "@icpswap/utils";

import { WalletIcon } from "./icons/WalletIcon";

export interface WalletBalanceProps {
  currencyBalance: CurrencyAmount<Token> | undefined;
  onClick?: () => void;
}

export function WalletBalance({ currencyBalance, onClick }: WalletBalanceProps) {
  return (
    <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={onClick}>
      <WalletIcon />

      <Tooltip tips={t`Wallet Balance`}>
        <Typography>{currencyBalance ? formatAmount(currencyBalance.toExact()) : "--"}</Typography>
      </Tooltip>
    </Flex>
  );
}
