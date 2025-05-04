import { useState, useMemo } from "react";
import { Typography, Box, Grid, Button, CircularProgress, Avatar, useTheme } from "components/Mui";
import { NoData, LoadingRow, Wrapper, Breadcrumbs, SelectToken } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { TOKEN_STANDARD, ResultStatus, type IcpSwapAPITokenInfo } from "@icpswap/types";
import { useToken } from "hooks/index";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { Identity as CallIdentity } from "types/global";
import { ICP } from "@icpswap/tokens";
import {
  useUserMisTransferredTokens,
  MisTransferredResult,
  withdrawMisTransferredToken,
} from "hooks/swap/useUserMisTransferredTokens";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

interface BalanceItemProps {
  pool: string;
  border?: boolean;
  token: Token;
  name: string | undefined;
  data: MisTransferredResult;
  balance: bigint;
  onClaimSuccess?: (symbol: string) => void;
  symbol: string;
}

export function BalanceItem({ token, symbol, balance, name, pool, data, onClaimSuccess }: BalanceItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [openTip, closeTip] = useTips();

  const handleClaim = async (identity: CallIdentity, { loading }: SubmitLoadingProps) => {
    if (loading) return;

    const loadingKey = openTip(
      `Reclaim your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    if (data) {
      const result = await withdrawMisTransferredToken(pool, token.address, "ICRC1");

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
                {t("common.retrieve")}
              </Button>
            )}
          </Identity>
        </Box>
      </Box>
    </Grid>
  );
}

export function BalancesItem({ balance }: { end: boolean; balance: MisTransferredResult }) {
  const [, token] = useToken(balance.tokenAddress);
  const [, token0] = useToken(balance.token0Address);
  const [, token1] = useToken(balance.token1Address);

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
  const { t } = useTranslation();
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
        <Breadcrumbs prevLink="/swap" prevLabel={t("common.swap")} currentLabel={t("swap.retrieve.your.tokens")} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
            {t("swap.retrieve.your.tokens")}
          </Typography>

          <Typography sx={{ margin: "10px 0 0 0" }}>{t("swap.retrieve.descriptions")}</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px", margin: "32px 0 0 0" }}>
            <Typography color="text.primary">{t("common.select.token")}</Typography>

            <Box sx={{ minWidth: "106px" }}>
              <SelectToken
                value={selectedTokenId}
                border
                onTokenChange={handleTokenChange}
                filter={(tokenInfo: IcpSwapAPITokenInfo) =>
                  tokenInfo.standard !== TOKEN_STANDARD.ICRC1 && tokenInfo.standard !== TOKEN_STANDARD.ICRC2
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
