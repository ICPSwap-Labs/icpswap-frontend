import { useState, useMemo } from "react";
import { Theme } from "@mui/material/styles";
import { Typography, Box, Grid, Button, CircularProgress, Avatar } from "@mui/material";
import { useTheme } from "@mui/styles";
import { NoData, LoadingRow, Wrapper, Breadcrumbs, SelectToken } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { TOKEN_STANDARD } from "@icpswap/constants";
import { ResultStatus } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { Identity as CallIdentity } from "types/global";
import { ICP } from "constants/index";
import {
  useUserMisTransferredTokens,
  MisTransferredResult,
  withdrawMisTransferredToken,
} from "hooks/swap/useUserMisTransferredTokens";

interface BalanceItemProps {
  pool: string;
  border?: boolean;
  token: TokenInfo;
  name: string | undefined;
  data: MisTransferredResult;
  balance: bigint;
  onClaimSuccess?: (symbol: string) => void;
  symbol: string;
}

export function BalanceItem({ token, symbol, balance, name, pool, data, onClaimSuccess }: BalanceItemProps) {
  const theme = useTheme() as Theme;

  const [openTip, closeTip] = useTips();

  const handleClaim = async (identity: CallIdentity, { loading }: SubmitLoadingProps) => {
    if (loading) return;

    const loadingKey = openTip(
      `Reclaim your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    if (data) {
      const result = await withdrawMisTransferredToken(pool, token.canisterId, "ICRC1");

      if (result.status === ResultStatus.OK) {
        openTip(`Retrieve ${name} ${token?.symbol} successfully`, MessageTypes.success);
        if (onClaimSuccess) onClaimSuccess(symbol);
      } else {
        openTip(result.message ?? `Failed to retrieve ${name} ${token.symbol}`, MessageTypes.error);
      }
    }

    closeTip(loadingKey);
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{ padding: "24px", borderRadius: "12px", background: theme.palette.background.level1, margin: "16px 0 0 0" }}
    >
      <Avatar src={token.logo} sx={{ width: "32px", height: "32px", margin: "0 12px 0 0" }}>
        &nbsp;
      </Avatar>

      <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography color="text.primary" sx={{ fontSize: "24px", fontWeight: 600 }}>
            {parseTokenAmount(balance, token.decimals).toFormat()} {token.symbol}
          </Typography>
          <Typography sx={{ margin: "4px 0 0 0" }}>{name}</Typography>
        </Box>

        <Box>
          <Identity onSubmit={handleClaim}>
            {({ submit, loading }: CallbackProps) => (
              <Button
                variant="contained"
                fullWidth
                size="medium"
                disabled={loading}
                onClick={submit}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
              >
                <Trans>Retrieve</Trans>
              </Button>
            )}
          </Identity>
        </Box>
      </Box>
    </Grid>
  );
}

export function BalancesItem({ balance }: { end: boolean; balance: MisTransferredResult }) {
  const { result: token } = useTokenInfo(balance.tokenAddress);
  const { result: token0 } = useTokenInfo(balance.token0Address);
  const { result: token1 } = useTokenInfo(balance.token1Address);

  const name = token0 && token1 ? `${token0.symbol}/${token1.symbol}` : "--";

  const [claimedSymbol, setClaimedSymbol] = useState<string[]>([]);

  const handleClaimedSuccess = (symbol: string) => {
    setClaimedSymbol([...new Set([...claimedSymbol, symbol])]);
  };

  const symbol = `${balance.poolId}_${balance.tokenAddress}`;

  return token && !claimedSymbol.includes(symbol) ? (
    <BalanceItem
      pool={balance.poolId}
      token={token}
      name={name}
      balance={balance.balance}
      data={balance}
      onClaimSuccess={handleClaimedSuccess}
      symbol={symbol}
    />
  ) : null;
}

export default function SwapFindMisTransferTokens() {
  const [selectedTokenId, setSelectedTokenId] = useState<string>(ICP.address);

  const { result, loading } = useUserMisTransferredTokens({ tokenId: selectedTokenId });

  const misTransferredTokens = useMemo(() => {
    if (!result) return [];
    return result
      .filter((ele) => ele.balance !== BigInt(0))
      .filter((ele) => ele.tokenAddress !== ele.token0Address && ele.tokenAddress !== ele.token1Address);
  }, [result]);

  const handleTokenChange = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  return (
    <Wrapper>
      <Box sx={{ margin: "10px 0 0 0" }}>
        <Breadcrumbs
          prevLink="/swap"
          prevLabel={<Trans>Swap</Trans>}
          currentLabel={<Trans>Retrieve Your Tokens</Trans>}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
            <Trans>Retrieve Your Tokens</Trans>
          </Typography>

          <Typography sx={{ margin: "10px 0 0 0" }}>
            <Trans>
              This function is designed to help you retrieve tokens that you may have accidentally sent to ICPSwap's
              swap pool canisters. It automatically searches for tokens that may have been misplaced in the Swap Pools
              and assists in transferring them back to you. First, select the token type you wish to retrieve, and then
              click on ' Retrieve ' after it complete searching.
            </Trans>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px", margin: "32px 0 0 0" }}>
            <Typography color="text.primary">
              <Trans>Select Token</Trans>
            </Typography>

            <Box sx={{ minWidth: "106px" }}>
              <SelectToken
                value={selectedTokenId}
                border
                onTokenChange={handleTokenChange}
                filter={(tokenInfo: TokenInfo) =>
                  tokenInfo.standardType !== TOKEN_STANDARD.ICRC1 && tokenInfo.standardType !== TOKEN_STANDARD.ICRC2
                }
              />
            </Box>
          </Box>

          <Box sx={{ margin: "20px 0 0 0" }}>
            {loading ? (
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            ) : misTransferredTokens.length > 0 ? (
              <Box
                sx={{
                  overflow: "auto",
                  margin: "-16px 0 0 0",
                }}
              >
                {misTransferredTokens.map((balance, index) => (
                  <BalancesItem key={index} balance={balance} end={index === misTransferredTokens.length - 1} />
                ))}
              </Box>
            ) : (
              <NoData />
            )}
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
}
