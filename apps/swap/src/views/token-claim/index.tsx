import { useState, useEffect } from "react";
import { Box, Typography, Avatar, CircularProgress, Button, useTheme } from "components/Mui";
import { TextButton, Wrapper, LoadingRow, ViewMore, NoData, Flex } from "components/index";
import { useUserClaimEvents, getUserClaimEvents, claimToken, useUserClaimEventTransactions } from "@icpswap/hooks";
import { ResultStatus, type ClaimEventInfo } from "@icpswap/types";
import { useAccountPrincipalString, useWalletIsConnected } from "store/auth/hooks";
import { pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import ConnectWallet from "components/ConnectWallet";
import { useTranslation } from "react-i18next";

export function TokenClaimItem({ ele }: { ele: ClaimEventInfo }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [, token] = useToken(ele.tokenCid);

  const [loading, setLoading] = useState(false);
  const [manuallyClaimed, setManuallyClaimed] = useState(false);

  const [openTip, closeTip] = useTips();

  const handleClaim = async () => {
    setLoading(true);
    const loadingKey = openTip(t("claim.loading.key", { name: ele.claimEventName }), MessageTypes.loading);

    const { status, message } = await claimToken(ele.claimEventId, ele.claimCanisterId);

    if (status === ResultStatus.OK) {
      setManuallyClaimed(true);
    }

    openTip(status === ResultStatus.OK ? t("claim.success") : getLocaleMessage(message), status);
    closeTip(loadingKey);
    setLoading(false);
  };

  const principalString = useAccountPrincipalString();

  const { result: userClaimTransactions, loading: claimTransactionLoading } = useUserClaimEventTransactions(
    principalString,
    ele.claimEventId,
    undefined,
    0,
    10,
  );

  const userClaimAmount = (userClaimTransactions?.content ?? []).filter(
    (transaction) => transaction.claimAmount > BigInt(0),
  )[0]?.claimAmount;

  const claimed =
    (userClaimTransactions?.content ?? []).filter((transaction) => transaction.claimStatus === BigInt(1)).length > 0;

  return (
    <Box
      sx={{
        background: theme.palette.background.level1,
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography>{ele.claimEventName}</Typography>
        <Box sx={{ margin: "8px 0 0 0", display: "flex", alignItems: "center" }}>
          <Avatar src={token?.logo ?? ""} sx={{ width: "20px", height: "20px" }}>
            &nbsp;
          </Avatar>
          <Typography sx={{ color: "#fff", margin: "0 0 0 8px", fontSize: "24px", fontWeight: 500 }}>
            {userClaimAmount ? parseTokenAmount(userClaimAmount, token?.decimals).toFormat() : "--"}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleClaim}
          disabled={loading || claimed || manuallyClaimed || claimTransactionLoading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {claimTransactionLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : claimed || manuallyClaimed ? (
            t("common.claimed")
          ) : (
            t("common.claim")
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default function TokenClaim() {
  const { t } = useTranslation();
  const principalString = useAccountPrincipalString();

  const pageSize = 5;

  const [page, setPage] = useState(1);
  const [offset] = pageArgsFormat(1, pageSize);
  const { result: _userClaimEvents, loading } = useUserClaimEvents(principalString, offset, pageSize);

  const [userClaimEvents, setUserClaimEvents] = useState<ClaimEventInfo[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (_userClaimEvents?.content) {
      setUserClaimEvents(_userClaimEvents.content);
    }
  }, [_userClaimEvents]);

  const handleMore = async () => {
    if (!principalString) return;

    setPage(page + 1);
    const [start] = pageArgsFormat(page + 1, pageSize);

    setLoadingMore(true);
    const _userClaimEvents = await getUserClaimEvents(principalString, start, pageSize);

    if (_userClaimEvents?.content) {
      setUserClaimEvents([...userClaimEvents, ..._userClaimEvents.content]);
    }

    setLoadingMore(false);
  };

  const isConnected = useWalletIsConnected();

  return isConnected ? (
    <Wrapper>
      <Box sx={{ maxWidth: "800px", width: "100%", margin: " 0 auto" }}>
        <Flex fullWidth justify="space-between">
          <Typography color="text.primary" fontWeight={500} fontSize="24px">
            {t("claim.your.tokens")}
          </Typography>
          <TextButton sx={{ fontSize: "16px", fontWeight: 500 }} to={`/token-claim/transactions/${principalString}`}>
            {t("claim.your.records")}
            &gt;
          </TextButton>
        </Flex>

        <Box mt="16px" sx={{ display: "grid", gridTemplateRows: "1fr", gap: "16px 0" }}>
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
          ) : (
            userClaimEvents.map((ele) => {
              return <TokenClaimItem key={ele.claimEventId} ele={ele} />;
            })
          )}

          {!loading && userClaimEvents.length === 0 ? <NoData tip={t("claim.empty")} /> : null}

          {!loading && Number(_userClaimEvents?.totalElements ?? 0) !== userClaimEvents.length ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ViewMore loading={loadingMore} onClick={handleMore} />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Wrapper>
  ) : (
    <ConnectWallet />
  );
}
