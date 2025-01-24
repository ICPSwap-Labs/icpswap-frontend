import { shorten } from "@icpswap/utils";
import type { Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Copy } from "components/Copy/icon";

interface PoolAndTokenBaseInfoProps {
  token: Token;
  poolId: string | Null;
}

export function PoolAndTokenBaseInfo({ token, poolId }: PoolAndTokenBaseInfoProps) {
  return (
    <Box>
      <Typography color="text.primary" fontWeight={600}>
        <Trans>Token Name</Trans>
        <Typography component="span" color="text.theme-secondary" fontWeight={600} sx={{ margin: "0 0 0 3px" }}>
          {token?.name}
        </Typography>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "12px 0 0 0" }}>
        <Typography
          color="text.primary"
          fontSize="12px"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
        >
          <Trans>Token</Trans>
          <Typography component="span" color="text.theme-secondary" fontSize="12px">
            {token ? shorten(token.address, 5) : "--"}
          </Typography>
          <Copy content={token.address} />
        </Typography>

        <Typography
          color="text.primary"
          fontSize="12px"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
        >
          <Trans>Pool</Trans>
          <Typography component="span" color="text.theme-secondary" fontSize="12px">
            {poolId ? shorten(poolId) : "--"}
          </Typography>
          <Copy content={poolId} />
        </Typography>
      </Box>
    </Box>
  );
}
