import { Box, Typography, useTheme, CircularProgress } from "components/Mui";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { useReclaim } from "hooks/swap/useReclaim";
import { useCallback, useState } from "react";
import { ArrowUpRight } from "react-feather";
import { Theme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";

export interface ReclaimForSinglePoolProps {
  balance: bigint;
  poolId: string;
  tokenId: string;
  type: "unUsed" | "unDeposit";
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
}: ReclaimForSinglePoolProps) {
  const history = useHistory();
  const theme = useTheme() as Theme;
  const [loading, setLoading] = useState(false);
  const { result: tokenInfo } = useTokenInfo(tokenId);

  const reclaim = useReclaim();

  const handleClaim = useCallback(async () => {
    if (!tokenInfo || loading) return;

    setLoading(true);

    const claimSuccess = await reclaim({ token: tokenInfo, poolId, type, balance });

    if (claimSuccess) {
      if (onReclaimSuccess) onReclaimSuccess();
    }

    setLoading(false);
  }, [tokenInfo, loading, reclaim]);

  const handleViewAll = useCallback(() => {
    history.push("/swap/reclaim");
  }, [history]);

  return tokenInfo ? (
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
