import { Box, useTheme, Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { useAccount, useAccountPrincipalString } from "store/auth/hooks";
import { Copy } from "components/Copy/icon";
import { Setting } from "components/Wallet/Setting";
import { JdenticonAvatar } from "components/JdenticonAvatar";
import { LogoutIcon } from "components/Wallet/LogoutIcon";

export function Header() {
  const theme = useTheme();
  const account = useAccount();
  const principal = useAccountPrincipalString();

  return (
    <Box
      sx={{
        padding: "16px 16px 24px 16px",
        background: theme.palette.background.level4,
        borderTopRightRadius: "24px",
        borderTopLeftRadius: "24px",
      }}
    >
      <Flex justify="space-between" fullWidth>
        {principal ? <JdenticonAvatar value={principal} /> : null}

        <Flex gap="0 8px">
          <Setting />
          <LogoutIcon />
        </Flex>
      </Flex>

      <Flex sx={{ margin: "16px 0 0 0", gap: "0 32px" }}>
        <Flex gap="0 8px">
          <Typography fontSize="12px">AID - {account ? shorten(account, 4) : ""}</Typography>
          <Copy content={account} color={theme.palette.text.secondary} />
        </Flex>
        <Flex gap="0 8px">
          <Typography fontSize="12px">PID - {principal ? shorten(principal, 4) : ""}</Typography>
          <Copy content={account} color={theme.palette.text.secondary} />
        </Flex>
      </Flex>
    </Box>
  );
}
