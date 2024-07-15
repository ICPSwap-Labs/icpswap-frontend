import { Box, Typography, CircularProgress } from "components/Mui";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { useReclaim } from "hooks/swap/useReclaim";
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { swapContext } from "components/swap/index";

export interface ReclaimForSinglePoolProps {
  balance: bigint;
  poolId: string;
  tokenId: string;
  type: "unUsed" | "unDeposit";
  id: string;
  viewAll?: boolean;
  onReclaimSuccess?: () => void;
}

export function ReclaimForSinglePool({
  balance,
  poolId,
  type,
  tokenId,
  onReclaimSuccess,
  id,
}: ReclaimForSinglePoolProps) {
  const [loading, setLoading] = useState(false);
  const { result: tokenInfo } = useTokenInfo(tokenId);
  const { setUnavailableBalanceKey, removeUnavailableBalanceKey, setRefreshTrigger } = useContext(swapContext);

  const reclaim = useReclaim();

  const handleClaim = useCallback(async () => {
    if (!tokenInfo || loading) return;

    setLoading(true);

    const claimSuccess = await reclaim({ token: tokenInfo, poolId, type, balance });

    if (claimSuccess) {
      if (onReclaimSuccess) onReclaimSuccess();
      setRefreshTrigger();
    }

    setLoading(false);
  }, [tokenInfo, loading, reclaim, setRefreshTrigger]);

  const hide = useMemo(() => {
    if (!tokenInfo) return false;

    return tokenInfo.transFee >= balance;
  }, [tokenInfo, balance]);

  useEffect(() => {
    if (hide) {
      setUnavailableBalanceKey(id);
    } else {
      removeUnavailableBalanceKey(id);
    }
  }, [hide, id]);

  return tokenInfo && !hide ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "0 0 12px 0",
        "&:last-of-type": {
          margin: "0",
        },
      }}
    >
      <Flex gap="0 8px">
        <Typography component="div">
          <Trans>
            Your {toSignificantWithGroupSeparator(parseTokenAmount(balance, tokenInfo.decimals).toString())}{" "}
            {tokenInfo.symbol} to{" "}
            <Typography color="secondary" component="span" sx={{ cursor: "pointer" }} onClick={handleClaim}>
              <Trans>Reclaim</Trans>
            </Typography>
          </Trans>
        </Typography>

        {loading ? <CircularProgress size={14} sx={{ color: "#ffffff" }} /> : null}
      </Flex>
    </Box>
  ) : null;
}
