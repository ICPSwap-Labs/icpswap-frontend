import { Flex } from "@icpswap/ui";
import { BigNumber, parseTokenAmount, shorten, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "components/Mui";
import { useAccountPrincipal } from "store/auth/hooks";
import Copy from "components/Copy";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

interface MintExtraContentProps {
  token: Token | Null;
  balance: BigNumber | Null;
}

export function MintExtraContent({ token, balance }: MintExtraContentProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  return (
    <>
      <Flex fullWidth vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>Your wallet of IC network</Trans>
          </Typography>

          <Copy content={principal ? principal.toString() : ""}>
            <Typography sx={{ cursor: "pointer" }}>{principal ? shorten(principal.toString(), 5) : "--"}</Typography>
          </Copy>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>{token?.symbol} Balance</Trans>
          </Typography>

          <Typography>
            {token && balance
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
