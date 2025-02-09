import { Typography } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { Flex, Tooltip } from "@icpswap/ui";
import { formatAmount } from "@icpswap/utils";
import { WalletIcon } from "assets/icons/swap/WalletIcon";
import { useTranslation } from "react-i18next";

export interface WalletBalanceProps {
  currencyBalance: CurrencyAmount<Token> | undefined;
  onClick?: () => void;
}

export function WalletBalance({ currencyBalance, onClick }: WalletBalanceProps) {
  const { t } = useTranslation();

  return (
    <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={onClick}>
      <WalletIcon />

      <Tooltip tips={t("common.wallet.balance")}>
        <Typography>{currencyBalance ? formatAmount(currencyBalance.toExact()) : "--"}</Typography>
      </Tooltip>
    </Flex>
  );
}
