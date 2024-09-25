import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "components/Mui";
import { useAccountPrincipal } from "store/auth/hooks";
import Copy from "components/Copy";

export function MintExtraContent() {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  return (
    <>
      <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>Your wallet of IC network</Trans>
          </Typography>

          <Copy content={principal ? principal.toString() : ""}>
            <Typography sx={{ cursor: "pointer" }}>{principal ? shorten(principal.toString(), 5) : "--"}</Typography>
          </Copy>
        </Flex>
      </Flex>

      <Box sx={{ margin: "16px 0 0 0", background: theme.palette.background.level3, width: "100%", height: "1px" }} />
    </>
  );
}
