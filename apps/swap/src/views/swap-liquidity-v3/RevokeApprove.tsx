import { useState, useMemo } from "react";
import { Typography, Box, Grid, Button, CircularProgress, Avatar, useMediaQuery, useTheme } from "components/Mui";
import { NoData, LoadingRow, Wrapper, Breadcrumbs, SelectToken } from "components/index";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import { ResultStatus, TOKEN_STANDARD } from "@icpswap/types";
import { useToken } from "hooks/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { ICP } from "@icpswap/tokens";
import { useGlobalContext } from "hooks/useGlobalContext";
import { useRevokeApprove, revoke } from "hooks/swap/useRevokeApprove";
import type { SwapPoolData, IcpSwapAPITokenInfo } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { parseTokenStandards } from "utils/parseTokenStandards";

export interface RevokeItemProps {
  tokenId: string;
  pool: SwapPoolData;
  allowance: bigint | undefined;
}

export function RevokeItem({ tokenId, pool, allowance }: RevokeItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const [openTip, closeTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [revoked, setRevoked] = useState<boolean>(false);

  const [, token0] = useToken(pool.token0.address);
  const [, token1] = useToken(pool.token1.address);

  const token = useMemo(() => {
    return tokenId === token0?.address ? token0 : token1;
  }, [tokenId, token0, token1]);

  const name = token0 && token1 ? `${token0.symbol}/${token1.symbol}` : "--";

  const handleRevoke = async () => {
    if (loading || !allowance || !token || !principal) return;

    setLoading(true);

    const loadingKey = openTip(
      `Revoke your ${toSignificant(parseTokenAmount(allowance, token.decimals).toString(), 8, {
        groupSeparator: ",",
      })} ${token.symbol}`,
      MessageTypes.loading,
    );

    const result = await revoke(tokenId, pool.canisterId.toString(), principal.toString());

    if (result.status === ResultStatus.OK) {
      openTip(`Revoke ${name} ${token.symbol} successfully`, MessageTypes.success);
      setRevoked(true);
    } else {
      openTip(`Failed to revoke: ${result.message ?? ""}`, MessageTypes.error);
    }

    closeTip(loadingKey);

    setLoading(false);
  };

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return !revoked ? (
    <Grid
      container
      alignItems="center"
      sx={{
        padding: "24px",
        borderRadius: "12px",
        background: theme.palette.background.level1,
        margin: "16px 0 0 0",
        gap: "0 12px",
        "@media(max-width: 640px)": {
          padding: "16px",
          alignItems: "flex-start",
        },
      }}
    >
      <Avatar
        src={token?.logo}
        sx={{
          width: "32px",
          height: "32px",
          "@media(max-width: 640px)": {
            width: "24px",
            height: "24px",
            margin: "3px 0 0 0",
          },
        }}
      >
        &nbsp;
      </Avatar>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          "@media(max-width:640px)": {
            flexDirection: "column",
            gap: "10px 0",
            alignItems: "flex-start",
            justifyContent: "center",
          },
        }}
      >
        <Box>
          <Typography
            color="text.primary"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              "@media(max-width: 640px)": {
                fontSize: "14px",
              },
            }}
          >
            {t("swap.approve.limit.colon")}&nbsp;
            <Typography
              color="text.primary"
              sx={{
                maxWidth: "260px",
                overflow: "hidden",
                display: "inline-block",
                textOverflow: "ellipsis",
                fontSize: "18px",
                fontWeight: 600,
                "@media(max-width: 640px)": {
                  fontSize: "14px",
                  maxWidth: "145px",
                },
              }}
              component="span"
            >
              {toSignificant(parseTokenAmount(allowance, token?.decimals).toString(), 8, { groupSeparator: "," })}
            </Typography>
            &nbsp;
            {token?.symbol}
          </Typography>
          <Typography sx={{ margin: "4px 0 0 0" }}>{name}</Typography>
          <Typography sx={{ margin: "4px 0 0 0" }}>{pool.canisterId.toString()}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0 10px",
            justifyContent: "flex-end",
            "@media(max-width: 640px)": {
              width: "100%",
            },
          }}
        >
          <Button
            variant="contained"
            size={matchDownSM ? "small" : "medium"}
            disabled={loading || !token || !principal || !allowance}
            onClick={handleRevoke}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {t("common.revoke")}
          </Button>
        </Box>
      </Box>
    </Grid>
  ) : null;
}

export default function SwapRevokeApprove() {
  const { t } = useTranslation();
  const [selectedTokenId, setSelectedTokenId] = useState<string>(ICP.address);

  const { AllPools } = useGlobalContext();

  const pools = useMemo(() => {
    if (!AllPools || !selectedTokenId) return undefined;
    return AllPools.filter(
      (pool) => pool.token0.address === selectedTokenId || pool.token1.address === selectedTokenId,
    );
  }, [AllPools, selectedTokenId]);

  const { result, loading } = useRevokeApprove({ pools, tokenId: selectedTokenId });

  const revokeResult = useMemo(() => {
    return result?.filter((e) => !!e.allowance);
  }, [result]);

  const tokenFilter = (tokenInfo: IcpSwapAPITokenInfo) => {
    return parseTokenStandards(tokenInfo) !== TOKEN_STANDARD.ICRC2;
  };

  return (
    <Wrapper>
      <Box sx={{ margin: "10px 0 0 0" }}>
        <Breadcrumbs prevLink="/swap" prevLabel={t("common.swap")} currentLabel={t("swap.revoke.token.approval")} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box
          sx={{
            width: "800px",
            "@media(max-width:640px)": {
              width: "100%",
            },
          }}
        >
          <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
            {t("swap.revoke.token.approval")}
          </Typography>

          <Typography sx={{ margin: "10px 0 0 0", lineHeight: "18px" }}>
            {t("swap.revoke.approval.description")}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0 20px", margin: "40px 0 0 0" }}>
            <Typography color="text.primary" fontWeight={500}>
              {t("common.select.token")}
            </Typography>

            <Box sx={{ minWidth: "160px" }}>
              <SelectToken
                search
                value={selectedTokenId}
                border
                filter={tokenFilter}
                onTokenChange={setSelectedTokenId}
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
            ) : revokeResult && revokeResult.length > 0 ? (
              <Box
                sx={{
                  overflow: "auto",
                  margin: "-16px 0 0 0",
                }}
              >
                {revokeResult.map((ele, index) => (
                  <RevokeItem key={index} pool={ele.pool} allowance={ele.allowance} tokenId={selectedTokenId} />
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
