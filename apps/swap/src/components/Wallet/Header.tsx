import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { Copy } from "components/Copy/icon";
import { JdenticonAvatar } from "components/JdenticonAvatar";
import { Box, Typography, useTheme } from "components/Mui";
import { LogoutIcon } from "components/Wallet/LogoutIcon";
import { Setting } from "components/Wallet/Setting";
import { useAccount, useAccountPrincipalString } from "store/auth/hooks";

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
          <Copy content={principal} color={theme.palette.text.secondary} />
        </Flex>
      </Flex>
    </Box>
  );
}
