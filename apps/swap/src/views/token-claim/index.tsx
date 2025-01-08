import { useState, useEffect } from "react";
import { Grid, Box, Typography, Avatar, CircularProgress, Button, useTheme } from "components/Mui";
import { t, Trans } from "@lingui/macro";
import { TextButton, Wrapper, LoadingRow, ViewMore, NoData } from "components/index";
import { useUserClaimEvents, getUserClaimEvents, claimToken, useUserClaimEventTransactions } from "@icpswap/hooks";
import { type ActorIdentity, ResultStatus, type ClaimEventInfo } from "@icpswap/types";
import { useAccountPrincipalString, useConnectorStateConnected } from "store/auth/hooks";
import { pageArgsFormat, parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks/index";
import Identity, { SubmitLoadingProps, CallbackProps } from "components/Identity";
import { useTips, MessageTypes } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import ConnectWallet from "components/ConnectWallet";

export function TokenClaimItem({ ele }: { ele: ClaimEventInfo }) {
  const theme = useTheme();
  const [, token] = useToken(ele.tokenCid);

  const [manuallyClaimed, setManuallyClaimed] = useState(false);

  const [openTip, closeTip] = useTips();

  const handleClaim = async (identity: ActorIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (!identity || loading) return;

    const loadingKey = openTip(t`Claiming ${ele.claimEventName}`, MessageTypes.loading);

    const { status, message } = await claimToken(ele.claimEventId, ele.claimCanisterId, identity);

    if (status === ResultStatus.OK) {
      setManuallyClaimed(true);
    }

    openTip(status === ResultStatus.OK ? t`Claimed successfully` : getLocaleMessage(message), status);

    closeTip(loadingKey);

    closeLoading();
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
        <Identity onSubmit={handleClaim}>
          {({ submit, loading }: CallbackProps) => (
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading || claimed || manuallyClaimed || claimTransactionLoading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {claimTransactionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : claimed || manuallyClaimed ? (
                <Trans>Claimed</Trans>
              ) : (
                <Trans>Claim</Trans>
              )}
            </Button>
          )}
        </Identity>
      </Box>
    </Box>
  );
}

export default function TokenClaim() {
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

  const isConnected = useConnectorStateConnected();

  return (
    <Wrapper>
      {isConnected ? (
        <Box sx={{ maxWidth: "800px", width: "100%", margin: " 0 auto" }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography color="text.primary" fontWeight={500} fontSize="24px">
              <Trans>Claim Your Tokens</Trans>
            </Typography>
            <TextButton sx={{ fontSize: "16px", fontWeight: 500 }} to={`/token-claim/transactions/${principalString}`}>
              <Trans>Your records</Trans> &gt;
            </TextButton>
          </Grid>

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

            {!loading && userClaimEvents.length === 0 ? <NoData /> : null}

            {!loading && Number(_userClaimEvents?.totalElements ?? 0) !== userClaimEvents.length ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ViewMore loading={loadingMore} onClick={handleMore} />
              </Box>
            ) : null}
          </Box>
        </Box>
      ) : (
        <ConnectWallet />
      )}
    </Wrapper>
  );
}
