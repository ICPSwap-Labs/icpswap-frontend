import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { BigNumber, parseTokenAmount, shorten, toSignificantWithGroupSeparator } from "@icpswap/utils";
import Copy from "components/Copy";
import { Box, Typography, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";

interface MintExtraContentProps {
  token: Token | Null;
  balance: BigNumber | Null;
}

export function MintExtraContent({ token, balance }: MintExtraContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  return (
    <>
      <Flex fullWidth vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
        <Flex justify="space-between" fullWidth>
          <Typography>{t("ck.wallet.of.ic")}</Typography>

          <Copy content={principal ? principal.toString() : ""}>
            <Typography>{principal ? shorten(principal.toString(), 5) : "--"}</Typography>
          </Copy>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Typography>{t("common.balance.symbol", { symbol: token?.symbol })}</Typography>

          <Typography>
            {balance && token
              ? `${toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString(), 4)} ${
                  token.symbol
                }`
              : "--"}
          </Typography>
        </Flex>
      </Flex>

      <Box sx={{ margin: "16px 0 0 0", background: theme.palette.background.level3, width: "100%", height: "1px" }} />
    </>
  );
}
