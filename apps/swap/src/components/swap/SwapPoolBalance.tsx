import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, Tooltip } from "@icpswap/ui";
import { BigNumber, formatAmount, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { CanisterIcon } from "assets/icons/swap/CanisterIcon";
import { Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export interface SwapPoolBalanceProps {
  token: Token | Null;
  subAccountBalance: string | Null;
  unusedBalance: bigint | Null;
  onClick?: () => void;
}

export function SwapPoolBalance({ token, subAccountBalance, unusedBalance, onClick }: SwapPoolBalanceProps) {
  const { t } = useTranslation();

  return (
    <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={onClick}>
      <CanisterIcon />

      <Tooltip tips={t("swap.pool.balance")}>
        <Typography>
          {nonUndefinedOrNull(unusedBalance) && nonUndefinedOrNull(token) && nonUndefinedOrNull(subAccountBalance)
            ? formatAmount(
                parseTokenAmount(
                  new BigNumber(unusedBalance.toString()).plus(subAccountBalance),
                  token.decimals,
                ).toString(),
              )
            : "--"}
        </Typography>
      </Tooltip>
    </Flex>
  );
}
