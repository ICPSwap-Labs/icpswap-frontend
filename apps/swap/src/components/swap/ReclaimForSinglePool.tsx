import { Box, Typography, useTheme, CircularProgress } from "components/Mui";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { useReclaim } from "hooks/swap/useReclaim";
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { ArrowUpRight } from "react-feather";
import { Theme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
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
  viewAll = false,
  id,
}: ReclaimForSinglePoolProps) {
  const history = useHistory();
  const theme = useTheme() as Theme;
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

  const handleViewAll = useCallback(() => {
    history.push("/swap/reclaim");
  }, [history]);

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
        width: "100%",
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

      {viewAll ? (
        <Flex gap="0 8px" sx={{ cursor: "pointer" }} onClick={handleViewAll}>
          <Typography color="secondary">
            <Trans>View All</Trans>
          </Typography>
          <ArrowUpRight color={theme.colors.secondaryMain} size="16px" />
        </Flex>
      ) : null}
    </Box>
  ) : null;
}
