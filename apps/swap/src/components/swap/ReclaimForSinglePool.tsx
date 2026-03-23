import { Flex } from "@icpswap/ui";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Box, CircularProgress, Typography } from "components/Mui";
import { SwapContext } from "components/swap/index";
import { useToken } from "hooks/index";
import { useReclaim } from "hooks/swap/useReclaim";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface ReclaimForSinglePoolProps {
  balance: bigint;
  poolId: string;
  tokenId: string;
  type: "unUsed" | "unDeposit";
  id: string;
  viewAll?: boolean;
  onReclaimSuccess?: () => void;
  fontSize?: string;
  margin?: string;
}

export function ReclaimForSinglePool({
  balance,
  poolId,
  type,
  tokenId,
  onReclaimSuccess,
  id,
  fontSize = "14px",
  margin = "12px",
}: ReclaimForSinglePoolProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [, token] = useToken(tokenId);
  const { setUnavailableBalanceKey, removeUnavailableBalanceKey } = useContext(SwapContext);

  const reclaim = useReclaim();

  const handleClaim = useCallback(async () => {
    if (!token || loading) return;

    setLoading(true);

    await reclaim({
      token,
      poolId,
      type,
      balance,
      refresh: () => {
        if (onReclaimSuccess) onReclaimSuccess();
      },
    });

    setLoading(false);
  }, [token, loading, reclaim, balance, onReclaimSuccess, poolId, type]);

  const hide = useMemo(() => {
    if (!token) return false;

    return token.transFee >= balance;
  }, [token, balance]);

  useEffect(() => {
    if (hide) {
      setUnavailableBalanceKey(id);
    } else {
      removeUnavailableBalanceKey(id);
    }
  }, [hide, id, removeUnavailableBalanceKey, setUnavailableBalanceKey]);

  return token && !hide ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: `0 0 ${margin} 0`,
        "&:last-of-type": {
          margin: "0",
        },
      }}
    >
      <Flex gap="0 8px">
        <Typography component="div" sx={{ fontSize }}>
          {t("swap.your.to.reclaim", {
            amount: `${toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString())} ${
              token.symbol
            }`,
          })}

          <Typography color="secondary" component="span" sx={{ cursor: "pointer", fontSize }} onClick={handleClaim}>
            {t("common.reclaim")}
          </Typography>
        </Typography>

        {loading ? <CircularProgress size={fontSize === "14px" ? 14 : 12} sx={{ color: "#ffffff" }} /> : null}
      </Flex>
    </Box>
  ) : null;
}
