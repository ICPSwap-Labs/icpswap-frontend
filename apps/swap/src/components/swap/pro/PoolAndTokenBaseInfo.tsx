import { shorten } from "@icpswap/utils";
import type { Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { Box, Typography } from "components/Mui";
import { Copy } from "components/Copy/icon";
import { useTranslation } from "react-i18next";
import { Link } from "@icpswap/ui";

interface PoolAndTokenBaseInfoProps {
  token: Token;
  poolId: string | Null;
}

export function PoolAndTokenBaseInfo({ token, poolId }: PoolAndTokenBaseInfoProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography color="text.primary" fontWeight={600}>
        {t("common.token.name")}
        <Link to={`/info-tokens/details/${token.address}`}>
          <Typography component="span" color="text.theme-secondary" fontWeight={600} sx={{ margin: "0 0 0 3px" }}>
            {token?.name}
          </Typography>
        </Link>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "12px 0 0 0" }}>
        <Typography
          color="text.primary"
          fontSize="12px"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
        >
          {t("common.token")}
          <Link to={`/info-swap/token/details/${token?.address}`}>
            <Typography component="span" color="text.theme-secondary" fontSize="12px">
              {token ? shorten(token.address, 5) : "--"}
            </Typography>
          </Link>
          <Copy content={token.address} />
        </Typography>

        <Typography
          color="text.primary"
          fontSize="12px"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
        >
          {t("common.pool")}
          <Link to={`/info-swap/pool/details/${poolId}`}>
            <Typography component="span" color="text.theme-secondary" fontSize="12px">
              {poolId ? shorten(poolId) : "--"}
            </Typography>
          </Link>
          <Copy content={poolId} />
        </Typography>
      </Box>
    </Box>
  );
}
