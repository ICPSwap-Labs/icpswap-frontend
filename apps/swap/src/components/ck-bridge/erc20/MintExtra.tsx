import { useMemo } from "react";
import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "components/Mui";
import { useAccountPrincipal } from "store/auth/hooks";
import { principalToBytes32 } from "utils/ic/index";

export function MintExtraContent() {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal.toString());
    return undefined;
  }, [principal]);

  return (
    <>
      <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>Your wallet of IC network</Trans>
          </Typography>

          <Typography>{principal ? shorten(principal.toString(), 5) : "--"}</Typography>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>Principal → Bytes32</Trans>
          </Typography>

          <Typography>{bytes32 ? shorten(bytes32, 5) : "--"}</Typography>
        </Flex>
      </Flex>

      <Box sx={{ margin: "16px 0 0 0", background: theme.palette.background.level3, width: "100%", height: "1px" }} />
    </>
  );
}
