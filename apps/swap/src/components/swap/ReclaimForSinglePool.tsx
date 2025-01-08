import { Box, Typography, CircularProgress } from "components/Mui";
import { Trans } from "@lingui/macro";
import { useToken } from "hooks/index";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { useReclaim } from "hooks/swap/useReclaim";
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { SwapContext } from "components/swap/index";

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
  }, [token, loading, reclaim]);

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
  }, [hide, id]);

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
          <Trans>
            Your {toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString())} {token.symbol}{" "}
            to{" "}
            <Typography color="secondary" component="span" sx={{ cursor: "pointer", fontSize }} onClick={handleClaim}>
              <Trans>Reclaim</Trans>
            </Typography>
          </Trans>
        </Typography>

        {loading ? <CircularProgress size={fontSize === "14px" ? 14 : 12} sx={{ color: "#ffffff" }} /> : null}
      </Flex>
    </Box>
  ) : null;
}
