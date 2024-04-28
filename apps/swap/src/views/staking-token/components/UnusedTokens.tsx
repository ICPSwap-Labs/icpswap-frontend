import { useMemo, useState } from "react";
import SwapModal from "components/modal/swap";
import { Typography, Box, Grid, Button, CircularProgress, Avatar } from "@mui/material";
import { useTheme } from "@mui/styles";
import { NoData, LoadingRow } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { UnusedBalance } from "types/staking-token";
import { TokenInfo } from "types/token";
import { CheckboxGroup, Checkbox } from "components/Checkbox";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { Identity as CallIdentity } from "types/global";
import { useUserUnusedTokens } from "hooks/staking-token/index";
import { stakingTokenClaim } from "@icpswap/hooks";

export function BalanceItem({
  token,
  balance,
  name,
  border = true,
  pool,
}: {
  pool: string;
  border?: boolean;
  token?: TokenInfo;
  balance: bigint;
  name: string | undefined;
}) {
  return (
    <Grid container alignItems="center" sx={{ borderBottom: !border ? "none" : "1px solid #313A5A", height: "64px" }}>
      <Avatar src={token?.logo} sx={{ width: "24px", height: "24px", margin: "0 8px 0 0" }}>
        &nbsp;
      </Avatar>
      <Typography color="text.primary">{parseTokenAmount(balance, token?.decimals).toFormat()}</Typography>
      <Grid item xs>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Typography color="text.primary" sx={{ margin: "0 32px 0 0" }}>
            {name}
          </Typography>
          <Checkbox value={`${pool}_${token?.canisterId}`} radio />
        </Grid>
      </Grid>
    </Grid>
  );
}

export function BalancesItem({ balance, end }: { end: boolean; balance: UnusedBalance }) {
  const { result: token0 } = useTokenInfo(balance.stakingToken.address);

  const name = token0 ? `${token0.symbol}` : "--";

  return (
    <BalanceItem
      pool={balance.canisterId.toString()}
      token={token0}
      balance={balance.balance}
      name={name}
      border={!end}
    />
  );
}

export interface WithdrawTokensModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WithdrawUnusedTokens({ open, onClose }: WithdrawTokensModalProps) {
  const theme = useTheme() as Theme;

  const [keys, setKeys] = useState<string[]>([]);
  const [reload, setReloadBalance] = useState(false);

  const { loading, result: balances } = useUserUnusedTokens(reload);

  const [openTip, closeTip] = useTips();

  const _balances = useMemo(() => {
    if (!balances) return [];

    return balances.filter((balance) => balance.balance !== BigInt(0));
  }, [balances]);

  const handleCheckChange = (checked: string[]) => {
    setKeys(checked);
  };

  const handleClaim = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading) return;
    const loadingKey = openTip("Reclaim your tokens", MessageTypes.loading);
    const calls: Promise<void>[] = [];

    for (let i = 0; i < keys.length; i++) {
      const temp = keys[i].split("_");
      const pool = temp[0];

      const balance = _balances.filter((balance) => balance.canisterId.toString() === pool)[0];

      if (balance) {
        const amount = balance.balance;

        if (amount !== BigInt(0)) {
          calls.push(
            stakingTokenClaim(pool).then(async (result) => {
              if (result.status === ResultStatus.OK) {
                openTip(`Withdrew ${balance.stakingTokenSymbol} successfully`, MessageTypes.success);
              } else {
                openTip(result.message ?? `Failed to Withdraw ${balance.stakingTokenSymbol}`, MessageTypes.error);
              }
            }),
          );
        }
      }
    }
    await Promise.all(calls);
    closeLoading();
    closeTip(loadingKey);
    setReloadBalance(!reload);
  };

  return (
    <SwapModal open={open} title={t`Reclaim your tokens`} onClose={onClose}>
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
      ) : _balances.length > 0 ? (
        <>
          <CheckboxGroup onChange={handleCheckChange}>
            <Box
              sx={{
                background: theme.palette.background.level3,
                borderRadius: "12px",
                border: `1px solid ${theme.palette.background.level4}`,
                padding: "0 24px",
                maxHeight: "348px",
                overflow: "auto",
              }}
            >
              {_balances.map((balance, index) => (
                <BalancesItem key={index} balance={balance} end={index === _balances.length - 1} />
              ))}
            </Box>
            <Box mt="24px">
              <Identity onSubmit={handleClaim} fullScreenLoading>
                {({ submit, loading }: CallbackProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!keys.length || loading}
                    onClick={submit}
                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                  >
                    <Trans>Withdraw</Trans>
                  </Button>
                )}
              </Identity>
            </Box>
          </CheckboxGroup>
        </>
      ) : (
        <NoData />
      )}
    </SwapModal>
  );
}
